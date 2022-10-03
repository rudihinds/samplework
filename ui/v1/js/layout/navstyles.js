import colors from '../utils/colors';
export default {
  headerStyle: {
    backgroundColor: colors.limedSpruce
  },

  profileMenuStyle: {
    display: 'flex',
    flexDirection: 'row',
    flexWrap: 'nowrap',
    alignItems: 'center',
    color: colors.white
  },

  profileItemMenuStyle: {
    width: 200,
    borderRadius: 4
  },

  iconLabelStyle: {
    color: colors.white,
    alignSelf: 'center'
  },

  desktopLogoStyle: {
    margin: '12px 0',
    cursor: 'pointer',
    textDecoration: 'none',
    display: 'inline-grid',
    gridTemplateColumns: 'min-content auto',
    gridGap: 8
  },

  menuItemStyle: {
    '&:hover': {
      color: colors.white
    },
    padding: '0.75rem 1.25rem',
    textDecoration: 'none',
    color: colors.white,
    fontWeight: 900,
    display: 'inline-block'
  },

  menuPillStyle: {
    '&:hover': {
      backgroundColor: colors.bizarre,
      color: colors.limedSpruce
    },
    borderRadius: 50,
    backgroundColor: colors.bizarre,
    color: colors.limedSpruce
  },

  flexMenuStyle: {
    display: 'flex',
    flexDirection: 'row',
    flexWrap: 'nowrap',
    alignItems: 'center',
    justifyContent: 'space-around',
    color: colors.bizarre
  }
};
