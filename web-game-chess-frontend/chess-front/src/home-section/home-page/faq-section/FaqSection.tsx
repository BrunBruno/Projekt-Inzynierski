import { forwardRef, useImperativeHandle } from "react";
import classes from "./FaqSection.module.scss";
import { HandleOnScroll } from "../../../shared/functions/Types";

type FaqSectionProps = {};

const FaqSection = forwardRef<HandleOnScroll, FaqSectionProps>(
  ({}: FaqSectionProps, ref: React.ForwardedRef<HandleOnScroll>) => {
    const handleOnScroll = () => {};
    useImperativeHandle(ref, () => ({
      handleOnScroll,
    }));
    return <section id="faq-section" className={classes.faq}></section>;
  }
);

export default FaqSection;
