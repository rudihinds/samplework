'use strict';

const Logger = use('Logger');
const { zip } = require('lodash');
const WEEKS_IN_YEAR = 52;

class PlanningService {
  static RETIREMENT_SELFCONT = 0; // Original value was 0.05, this is preserved because it might come back later
  static PARTNER_LEAVE_BUMP = 0.07; // using one just for multiplication
  static CAP_PARAMS = {
    female: {
      experience: 0.0487,
      experienceSquared: -0.00089,
      nonEmployment: -0.0431,
      nonEmploymentSquared: 0.00145
    },
    male: {
      experience: 0.0536,
      experienceSquared: -0.00101,
      nonEmployment: -0.0627,
      nonEmploymentSquared: 0.00246
    }
  };

  constructor({ user, years }) {
    this.user = user;
    this.years = Number(years);
  }

  /**
   * List expenses in the projected years. Expenses like: fertility treatment and child care costs
   *
   * @param {object} params
   * @param {numeric} params.childbirth_on_year
   */
  async calculateExpenses({ childbirth_on_year }) {
    const expenses = await this.user.expense().first();
    const childCareAnnually = Number(expenses.child_care_cost) * 12; // Months
    const { child_care_type: childCareType, fertility_treatment_type: fertilityTreatmentType } = expenses.toJSON();
    const fertilityTreatmentCosts = Number(expenses.fertility_treatment_cost);
    const results = [];

    for (let year = 0; year < this.years; year++) {
      let expensesInYear = 0;
      const result = { x: new Date().getFullYear() + year, y: 0, expenses: 0, breakdown: [] };

      // Fertility treatment costs are one year prior child birth
      // year = [index of year, 0-4] for 5 years as default
      // childbirth_on_year = [index of childbirth year relative to curr yr index] 
      // current year index is 1 
      
      if (year === childbirth_on_year - 2 && childbirth_on_year > 0) {
        result.breakdown.push({
          label: fertilityTreatmentType,
          value: fertilityTreatmentCosts.toFixed(2),
          negative: fertilityTreatmentCosts > 0
        });
        expensesInYear += fertilityTreatmentCosts;
      }

      // Child care expenses are always after child birth
      if (year >= childbirth_on_year - 1 && childbirth_on_year > 0) {
        result.breakdown.push({
          label: childCareType,
          value: childCareAnnually.toFixed(2),
          negative: childCareAnnually > 0
        });
        expensesInYear += childCareAnnually;
      }

      result.y = expensesInYear;
      result.expenses = expensesInYear.toFixed(2);
      results.push(result);
    }

    return results;
  }

  /**
   * Create a income projection including income growth and income penalties given by different factors, like:
   * unpaid parental leave, part time work, experience and non-employment
   *
   * parental_leave = How many WEEKS of Salary PAID for parental leave
   * parental_leave_percentage = What PERCENTAGE of salary PAID by employer for parental leave
   * unpaid_parental_leave = How many WEEKS OF salary UNPAID for parental leave 
   * 
   * @param {object} params
   * @param {numeric} params.childbirth_on_year
   */
  async calculateIncomePlan({ childbirth_on_year }) {
    try {
      const yearOfBirth = childbirth_on_year - 1;
      const income = await this.user.income().fetch();
      const benefits = await this.user.benefit().fetch();

      const hasPartner = this.user.has_partner;
      const sameGenderFemale = this.user.gender === 'female' && this.user.partner_gender === 'female';
      let parentalLeave = 0;
      if (this.user.is_primary_care_giver) {
        parentalLeave = benefits.parental_leave_partner + benefits.unpaid_parental_leave_partner;
      } else {
        parentalLeave = benefits.parental_leave + benefits.unpaid_parental_leave;
      }

      const needsBump = hasPartner && !sameGenderFemale && parentalLeave >= 4;

      let partnerEstimation = {};
      if (this.user.has_partner) {
        const partnerParams = this._getCapParams(this.user.partner_gender);
        const partner = {
          salary: Number(income.partner),
          hoursPerWeek: Number(income.full_time_hrs_partner),
          age: this.user.partner_age,
          isFemale: this.user.partner_gender === 'female',
          career_begin_age: this.user.partner_career_begin_age,
          isPrimaryCareGiver: !this.user.is_primary_care_giver,
          paidLeaveWeeks: benefits.parental_leave_partner,
          paidLeavePercentage: benefits.parental_leave_percentage_partner,
          unpaidLeaveWeeks: benefits.unpaid_parental_leave_partner,
          partTimeWorkHrs: benefits.part_time_work_partner,
          partTimeWorkWeeks: benefits.part_time_length_partner,
          yearOfBirth: yearOfBirth,
          params: partnerParams,
          name: this.user.partner_name,
          needsBump
        };

        partnerEstimation = this._calculateIncomeEstimation(partner);
      } else {
        partnerEstimation = Array(this.years)
          .fill(null)
          .map((_, index) => {
            const year = new Date().getFullYear() + index;
            return {
              x: year,
              y: 0,
              income: 0,
              assetLoss: 0,
              baseSalary: 0,
              breakdown: []
            };
          });
      }

      const selfParams = this._getCapParams(this.user.gender);
      const myself = {
        salary: Number(income.myself),
        hoursPerWeek: Number(income.full_time_hrs),
        age: this.user.age,
        isFemale: this.user.gender === 'female',
        career_begin_age: this.user.career_begin_age,
        isPrimaryCareGiver: this.user.is_primary_care_giver,
        paidLeaveWeeks: benefits.parental_leave,
        paidLeavePercentage: benefits.parental_leave_percentage,
        unpaidLeaveWeeks: benefits.unpaid_parental_leave,
        partTimeWorkHrs: benefits.part_time_work,
        partTimeWorkWeeks: benefits.part_time_length,
        yearOfBirth: yearOfBirth,
        params: selfParams,
        name: this.user.name,
        has_partner: this.user.has_partner,
        needsBump
      };
      const selfEstimation = this._calculateIncomeEstimation(myself);

      const selfAssetLoss = selfEstimation.map((estimation) => Number(estimation.assetLoss));
      const partnerAssetLoss = partnerEstimation.map((estimation) => Number(estimation.assetLoss));
      const totalLoss = zip(selfAssetLoss, partnerAssetLoss)
        .map((tuple) => tuple.reduce((sum, current) => sum + current))
        .map((el) => el.toFixed(2));

      return {
        selfIncome: selfEstimation,
        partnerIncome: partnerEstimation,
        totalLoss: totalLoss
      };
    } catch (e) {
      Logger.error(e.toString());
    }
  }

  /**
   * Perform simulation for a user
   *
   * @param {object} user
   * @returns {object}
   */
  _calculateIncomeEstimation(user) {
    const results = [];
    const applyPenalties = Boolean(user.isFemale && user.isPrimaryCareGiver);
    const preCalculations = this._preCalculations(user);
    const fullYear = new Date().getFullYear();
    for (let year = 0; year < this.years; year++) {
      const currentEstimation = {
        year: year,
        currentAge: preCalculations.currentAge,
        yearsExperience: preCalculations.experience,
        yearsNonExperience: preCalculations.nonEmployment,
        startSalary: preCalculations.startSalary
      };

      // const compoundedIncome = this._calculateCompoundIncome(user, currentEstimation);
      const { realSalaryEstimate: compoundedIncome, baseSalary } = this._calculateCompoundIncome(
        user,
        currentEstimation
      );
      let {
        realSalaryEstimate: penalizedIncome,
        baseSalary: penalizedBaseSalary,
        paternityBump
      } = this._calculateCompoundIncomeWithPenalty(user, currentEstimation);
      const motherhoodSalaryPenalty = baseSalary - penalizedBaseSalary;
      const penalizedIncomePerWeek = penalizedIncome / WEEKS_IN_YEAR;
      const penalizedIncomePerHr = user.hoursPerWeek !== 0 ? penalizedIncomePerWeek / user.hoursPerWeek : 0;
      let assetLoss = 0;
      let weeksLeftInYear = WEEKS_IN_YEAR;

      // Apply paid parental leave before the unpaid parental leave
      // This is just a skip ok weeks, user is still earning money this time
      let paidLeaveLoss = 0;
      if (weeksLeftInYear > 0 && user.yearOfBirth >= 0 && year >= user.yearOfBirth && user.paidLeaveWeeks > 0) {
        const penalizedIncomeInPaidLeavePerWeek = penalizedIncomePerWeek * (user.paidLeavePercentage / 100);
        if (user.paidLeaveWeeks > weeksLeftInYear) {
          paidLeaveLoss = (penalizedIncomePerWeek - penalizedIncomeInPaidLeavePerWeek) * weeksLeftInYear;
          user.paidLeaveWeeks -= weeksLeftInYear;
          weeksLeftInYear = 0;
        } else {
          paidLeaveLoss = (penalizedIncomePerWeek - penalizedIncomeInPaidLeavePerWeek) * user.paidLeaveWeeks;
          weeksLeftInYear -= user.paidLeaveWeeks;
          user.paidLeaveWeeks = 0;
        }
        penalizedIncome = penalizedIncome - paidLeaveLoss;
      }

      // Apply unpaid parental leave time
      let unpaidLeaveLoss = 0;
      if (weeksLeftInYear > 0 && user.yearOfBirth >= 0 && year >= user.yearOfBirth && user.unpaidLeaveWeeks > 0) {
        if (user.unpaidLeaveWeeks > weeksLeftInYear) {
          // User loses everything or a fraction this year
          unpaidLeaveLoss = penalizedIncomePerWeek * weeksLeftInYear; // income per week *times* unpaid weeks
          user.unpaidLeaveWeeks -= weeksLeftInYear;
          weeksLeftInYear = 0;
        } else {
          // User loses just a fraction this year
          unpaidLeaveLoss = penalizedIncomePerWeek * user.unpaidLeaveWeeks; // income per week *times* unpaid weeks
          weeksLeftInYear -= user.unpaidLeaveWeeks;
          user.unpaidLeaveWeeks = 0;
        }
        penalizedIncome = penalizedIncome - unpaidLeaveLoss;
        // If you have any number of weeks of unpaid leave in this year you don't get experience and nonEmployment grows
        preCalculations.nonEmployment += 1;
      } else {
        preCalculations.experience += 1;
      }

      // Apply part time work
      let partTimeWorkIncomeLoss = 0;
      if (
        weeksLeftInYear > 0 &&
        user.yearOfBirth >= 0 &&
        year >= user.yearOfBirth &&
        user.partTimeWorkWeeks > 0 &&
        user.partTimeWorkHrs > 0
      ) {
        const partTimeWorkIncomePerWeek = penalizedIncomePerHr * user.partTimeWorkHrs;
        if (user.partTimeWorkWeeks > weeksLeftInYear) {
          partTimeWorkIncomeLoss = (penalizedIncomePerWeek - partTimeWorkIncomePerWeek) * weeksLeftInYear;
          user.partTimeWorkWeeks -= weeksLeftInYear;
          weeksLeftInYear = 0;
        } else {
          partTimeWorkIncomeLoss = (penalizedIncomePerWeek - partTimeWorkIncomePerWeek) * user.partTimeWorkWeeks;
          weeksLeftInYear -= user.partTimeWorkWeeks;
          user.partTimeWorkWeeks = 0;
        }
        penalizedIncome = penalizedIncome - partTimeWorkIncomeLoss;
      }

      // Calculate the asset loss of current year only if the user has selected a year of birth
      // otherwise asset loss is zero
      if (user.yearOfBirth >= 0 && year >= user.yearOfBirth) {
        assetLoss = compoundedIncome - penalizedIncome;
      }

      preCalculations.currentAge += 1;
      // NOTE: totalLoss (assetLoss) references to Motherhood Penalty,
      // so if the user is not a woman and the primary care giver,
      // there should not be a motherhood penalty.
      const totalLoss = applyPenalties ? assetLoss : 0;
      // But, all penalties related of experience, unpaid leave and part time work,
      // either the user is a man or a woman are always substracted from compoundedIncome
      const totalCompoundedIncome = compoundedIncome - assetLoss;
      // In result, the motherhood penalty bar is only created just when the primary care giver
      // is woman. But both of them are being penalized about their decisions
      const penaltyLabel = this._penaltyLabel(this.user);
      results.push({
        username: user.name,
        has_partner: user.has_partner,
        y: Number(totalCompoundedIncome.toFixed(2)),
        x: fullYear + year,
        assetLoss: totalLoss.toFixed(2),
        income: totalCompoundedIncome.toFixed(2),
        baseSalary: baseSalary.toFixed(2),
        breakdown: [
          {
            // label: `${penaltyLabel} Penalty`,
            label: 'Parenthood Penalty',
            value: Math.abs(motherhoodSalaryPenalty).toFixed(2),
            apply: applyPenalties,
            negative: motherhoodSalaryPenalty > 0
          },
          {
            label: 'Your partner took leave!',
            value: Math.abs(paternityBump).toFixed(2),
            apply: true,
            negative: paternityBump < 0
          },
          {
            label: 'Paid Leave',
            value: Math.abs(paidLeaveLoss).toFixed(2),
            apply: true,
            negative: paidLeaveLoss > 0
          },
          {
            label: 'Unpaid Leave',
            value: Math.abs(unpaidLeaveLoss).toFixed(2),
            apply: true,
            negative: unpaidLeaveLoss > 0
          },
          {
            label: 'Part-time Work',
            value: Math.abs(partTimeWorkIncomeLoss).toFixed(2),
            apply: true,
            negative: partTimeWorkIncomeLoss > 0
          }
        ]
      });
    }

    return results;
  }

  /**
   * @param {object} user
   * @returns {object}
   */
  _preCalculations(user) {
    const experience = user.age - user.career_begin_age;
    const nonEmployment = 0;
    const startSalary =
      user.salary / (1 + experience * user.params.experience + experience * experience * user.params.experienceSquared);

    return { experience, nonEmployment, startSalary, currentAge: user.age };
  }

  /**
   * @param {object} user
   * @param {object} currentEstimation
   * @returns {numeric}
   */
  _calculateCompoundIncome(user, currentEstimation) {
    const adjustedExperience = currentEstimation.yearsExperience + currentEstimation.yearsNonExperience;
    const capCoeff =
      1 +
      adjustedExperience * user.params.experience +
      adjustedExperience * adjustedExperience * user.params.experienceSquared;

    const baseSalary = currentEstimation.startSalary * capCoeff;
    const retirementContribution = baseSalary * PlanningService.RETIREMENT_SELFCONT;
    const realSalaryEstimate = baseSalary - retirementContribution;

    return { realSalaryEstimate, baseSalary, retirementContribution };
  }

  /**
   * @param {object} user
   * @param {object} currentEstimation
   * @returns {numeric}
   */
  _calculateCompoundIncomeWithPenalty(user, currentEstimation) {
    const experienceCoeffHalf =
      currentEstimation.yearsExperience * user.params.experience +
      currentEstimation.yearsExperience * currentEstimation.yearsExperience * user.params.experienceSquared;
    const nonExperienceCoeffHalf =
      currentEstimation.yearsNonExperience * user.params.nonEmployment +
      currentEstimation.yearsNonExperience * currentEstimation.yearsNonExperience * user.params.nonEmploymentSquared;
    const capCoeff = 1 + experienceCoeffHalf + nonExperienceCoeffHalf;
    const baseSalary = currentEstimation.startSalary * capCoeff;
    let paternityBump = 0;
    let realSalaryEstimate = baseSalary;
    if (
      user.isPrimaryCareGiver &&
      user.needsBump &&
      currentEstimation.year >= user.yearOfBirth &&
      user.yearOfBirth >= 0
    ) {
      paternityBump = baseSalary * PlanningService.PARTNER_LEAVE_BUMP;
      realSalaryEstimate = realSalaryEstimate + paternityBump;
    }
    const retirementContribution = realSalaryEstimate * PlanningService.RETIREMENT_SELFCONT;
    realSalaryEstimate = realSalaryEstimate - retirementContribution;

    return { realSalaryEstimate, paternityBump, baseSalary, retirementContribution };
  }

  _getCapParams(gender) {
    return PlanningService.CAP_PARAMS[gender] || PlanningService.CAP_PARAMS.male;
  }

  _penaltyLabel(user) {
    const isMotherhood =
      (user.gender === 'female' && user.is_primary_care_giver) ||
      (user.has_partner && user.partner_gender === 'female' && !user.is_primary_care_giver);

    return isMotherhood ? 'Motherhood' : 'Parenthood';
  }
}

module.exports = PlanningService;
