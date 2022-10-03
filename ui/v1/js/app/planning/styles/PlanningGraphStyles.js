import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles(
  ({ colors }) => ({
    checkboxCont: {
      alignSelf: 'flex-start'
    },
    checkboxLabelText: {
      fontSize: '0.85rem',
      fontWeight: 800,
      color: colors.capecod
    },
    exportContainer: {
      marginTop: -30,
      marginBottom: 10,
      textAlign: 'right'
    }
  }),
  { name: 'PlanningGraph' }
);

export default useStyles;
