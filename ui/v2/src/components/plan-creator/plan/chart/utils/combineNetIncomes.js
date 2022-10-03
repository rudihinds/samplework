const combineNetIncomes = ({ self, partner }) => {
  // Combine net incomes
  // If self contains negatives then self is lowerIncome
  // partner.map((net, index) => net - self[index])

  if (self?.ok && !partner?.ok) {
    return {
      self: self.response.data.user_results.net_income.slice(0, 20),
      partner: []
    };
  }
  if (!self?.ok && partner?.ok) {
    return {
      self: [],
      partner: partner.response.data.user_results.net_income.slice(0, 20)
    };
  }
  if (self?.ok && partner?.ok) {
    const selfNetIncome = self.response.data.user_results.net_income.slice(
      0,
      20
    );
    const partnerNetIncome = partner.response.data.user_results.net_income.slice(
      0,
      20
    );

    // If self has negatives
    // Then partner makes up for losses
    if (selfNetIncome.filter((net) => net < 0).length > 0) {
      const partnerNetIncomeAdjusted = partnerNetIncome.map((net, index) => {
        if (selfNetIncome[index] < 0) {
          return net + selfNetIncome[index];
        }
        return net;
      });
      const selfNetIncomeNoNegative = selfNetIncome.map((net) => {
        if (net < 0) {
          return 0;
        }
        return net;
      });
      return {
        self: selfNetIncomeNoNegative,
        partner: partnerNetIncomeAdjusted
      };
    }

    // If partner has negatives
    // Then self makes up for losses
    if (partnerNetIncome.filter((net) => net < 0).length > 0) {
      const selfNetIncomeAdjusted = selfNetIncome.map((net, index) => {
        if (partnerNetIncome[index] < 0) {
          return net + partnerNetIncome[index];
        }
        return net;
      });
      const partnerNetIncomeNoNegative = partnerNetIncome.map((net) => {
        if (net < 0) {
          return 0;
        }
        return net;
      });
      return {
        self: selfNetIncomeAdjusted,
        partner: partnerNetIncomeNoNegative
      };
    }

    return { self: selfNetIncome, partner: partnerNetIncome };
  }
  return { self: [], partner: [] };
};

export default combineNetIncomes;
