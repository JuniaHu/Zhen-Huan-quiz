import { motion } from "framer-motion";
import type { QuizQuestion } from "../data/sbtiData";

interface QuestionCardProps {
  question: QuizQuestion;
  questionIndex: number;
  total: number;
  selectedIndex?: number;
  onSelect: (optionIndex: number) => void;
}

export function QuestionCard({
  question,
  questionIndex,
  total,
  selectedIndex,
  onSelect,
}: QuestionCardProps) {
  return (
    <motion.section
      key={question.id}
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -24 }}
      transition={{ duration: 0.45, ease: "easeOut" }}
      className="rounded-[2rem] border border-bronze/10 bg-white/65 p-6 shadow-card backdrop-blur md:p-8"
    >
      <div className="mb-6 flex items-center justify-between text-sm text-ink/70">
        <span className="rounded-full bg-bronze/10 px-3 py-1 font-display">
          第 {questionIndex + 1} / {total} 题
        </span>
        <span className="font-body uppercase tracking-[0.28em]">ZHBI</span>
      </div>

      <h2 className="max-w-3xl font-display text-[1.85rem] leading-[1.65] text-ink md:text-[2.3rem]">
        {question.q}
      </h2>

      <p className="mt-3 font-body text-sm leading-7 text-ink/55 md:text-base">
        选最像你下意识反应的那个，不用选“正确答案”。
      </p>

      <div className="mt-8 grid gap-4">
        {question.options.map((option, optionIndex) => {
          const selected = selectedIndex === optionIndex;

          return (
            <motion.button
              key={option.text}
              whileHover={{ y: -2, scale: 1.01 }}
              whileTap={{ scale: 0.99 }}
              onClick={() => onSelect(optionIndex)}
              className={[
                "group rounded-[1.75rem] border px-5 py-5 text-left transition md:px-6 md:py-5",
                selected
                  ? "border-bronze bg-bronze text-parchment shadow-lg shadow-bronze/15"
                  : "border-bronze/15 bg-parchment/70 text-ink hover:border-bronze/40 hover:bg-white",
              ].join(" ")}
            >
              <div className="flex items-start gap-4">
                <span
                  className={[
                    "mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-full border text-sm font-display md:h-10 md:w-10",
                    selected
                      ? "border-parchment/70 text-parchment"
                      : "border-bronze/20 text-bronze group-hover:border-bronze/40",
                  ].join(" ")}
                >
                  {String.fromCharCode(65 + optionIndex)}
                </span>
                <span className="font-body text-[1.02rem] leading-8 md:text-[1.08rem]">
                  {option.text}
                </span>
              </div>
            </motion.button>
          );
        })}
      </div>
    </motion.section>
  );
}
