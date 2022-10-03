import React, { useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { ContentPanel, SubTaskCard, Tooltip, CommitmentsWrap, SquareButton, Icon } from '../../elements';
import CommitmentsEmailModal from './CommitmentsEmailModal';

const useStyles = makeStyles(
  ({ colors }) => ({
    buttonContainer: {
      display: 'grid',
      gridGap: 20,
      gridTemplateColumns: 'repeat(auto-fit, minmax(200px, max-content))',
      alignItems: 'center'
    },
    tooltipSpan: {
      display: 'inline-block'
    }
  }),
  { name: 'CommitmentsView' }
);

const CommitmentsView = () => {
  const classes = useStyles();
  const subTasks = {
    1: 'Drop off dry-cleaning',
    2: 'Pick up dry-cleaning',
    3: 'Check out our various benefits packages (gym, bank etc) to see if we have any deals for other dry cleaners'
  };

  const [isOpen, setIsOpen] = useState(false);
  const openDialog = () => {
    setIsOpen(true);
  };

  const closeDialog = (ev) => {
    ev.preventDefault();
    setIsOpen(false);
  };

  return (
    <CommitmentsWrap fullOnMobile>
      <CommitmentsEmailModal isOpen={isOpen} handleClose={closeDialog} />
      <ContentPanel
        theme="round-bottom"
        navAction={{ text: 'Ownership of dry cleaning', to: '/commitments/add' }}
        bottomContent={
          <div className={classes.buttonContainer}>
            <span>
              <SquareButton data-sel="my-commitments-button" onClick={openDialog} icon="user">
                Add to my commitments
              </SquareButton>
            </span>
            <span>
              <SquareButton
                data-sel="our-commitments-button"
                onClick={openDialog}
                theme="secondary"
                icon="multi-user"
                ghost
              >
                Add to our commitments
              </SquareButton>
            </span>
            <span>
              <Tooltip
                content={
                  <div>
                    <p>
                      <strong>&quot;Add to my commitments&quot;</strong> makes you the sole owner for all the tasks
                      included here.
                    </p>
                    <p>
                      <strong>&quot;Add to our commitments&quot;</strong> means the ownership is shared. You and your
                      partner can decide who owns each task individually.
                    </p>
                  </div>
                }
              >
                <span className={classes.tooltipSpan}>
                  <Icon icon="question-circle" width={24} />
                </span>
              </Tooltip>
            </span>
          </div>
        }
      >
        <SubTaskCard title="Your tasks" subtasks={subTasks}>
          You will own the dry-cleaning. From dropping it off to picking it up (or at least organizing for it to happen)
        </SubTaskCard>
      </ContentPanel>
    </CommitmentsWrap>
  );
};

export default CommitmentsView;
