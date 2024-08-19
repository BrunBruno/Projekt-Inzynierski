import { QuestionsType } from "../FaqSectionQuestions";
import classes from "./FaqSectionCard.module.scss";

type FaqSectionCardProps = {
  faq: QuestionsType;
  index: number;
};

function FaqSectionCard({ faq, index }: FaqSectionCardProps) {
  return (
    <div className={classes["faq-card"]}>
      <h5>
        <span>#{index + 1} </span>
        {faq.question}
      </h5>
      <p className={classes.text}>{faq.answer}</p>
      <p className={classes.see}>Check the Answer</p>
    </div>
  );
}

export default FaqSectionCard;
