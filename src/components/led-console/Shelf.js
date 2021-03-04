import { makeStyles } from "@material-ui/core/styles";

import Led from "./Led";

const useStyles = makeStyles((theme) => ({
  shelfOuter: {
    padding: theme.spacing(1, 2),
    marginBottom: theme.spacing(4),
  },
  shelf: {
    display: "grid",
    gridTemplateColumns: "repeat(50, 1fr)",
  },
  name: {
    userSelect: "none",
    marginBottom: theme.spacing(3),
  },
}));

const Shelf = ({ name, leds, selectedLedIds }) => {
  const classes = useStyles();

  return (
    <div className={classes.shelfOuter}>
      <h3 className={classes.name}>{name}</h3>

      <div className={classes.shelf}>
        {leds.map(({ id, ref, props }) => (
          <Led
            key={id}
            ref={ref}
            isSelected={selectedLedIds.includes(id)}
            {...props}
          />
        ))}
      </div>
    </div>
  );
};

export default Shelf;
