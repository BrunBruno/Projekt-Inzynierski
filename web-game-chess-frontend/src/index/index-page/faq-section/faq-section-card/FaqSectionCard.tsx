import { QuestionsType } from "../FaqSectionData";
import classes from "./FaqSectionCard.module.scss";

type FaqSectionCardProps = {
  // card data question/answer
  faq: QuestionsType;
  // card index
  index: number;
};

function FaqSectionCard({ faq, index }: FaqSectionCardProps) {
  ///

  return (
    <div className={classes.card}>
      <h5 className={classes.question}>
        <span>#{index + 1} </span>
        {faq.question}
      </h5>
      <p className={classes.answer}>{faq.answer}</p>
      <p className={classes.action}>Check the Answer</p>
    </div>
  );
}

export default FaqSectionCard;
