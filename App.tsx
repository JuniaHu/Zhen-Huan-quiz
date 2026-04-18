import { AnimatePresence, motion } from "framer-motion";
import { useMemo, useState } from "react";
import { QuestionCard } from "./components/QuestionCard";
import { RadarChart } from "./components/RadarChart";
import {
  dimensionMeta,
  dimensionOrder,
  quizData,
  shareCopy,
} from "./data/sbtiData";
import { downloadResultCard } from "./lib/share";
import { calculateScore, createEmptyScore, findBestMatch } from "./lib/scoring";

type Stage = "intro" | "quiz" | "result";

export default function App() {
  const [stage, setStage] = useState<Stage>("intro");
  const [answers, setAnswers] = useState<number[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);

  const score = useMemo(
    () => (answers.length ? calculateScore(quizData, answers) : createEmptyScore()),
    [answers],
  );
  const result = useMemo(() => findBestMatch(score), [score]);

  const startQuiz = () => {
    setAnswers([]);
    setCurrentIndex(0);
    setStage("quiz");
  };

  const handleSelect = (optionIndex: number) => {
    const nextAnswers = [...answers];
    nextAnswers[currentIndex] = optionIndex;
    setAnswers(nextAnswers);

    if (currentIndex === quizData.length - 1) {
      setStage("result");
      return;
    }

    setCurrentIndex((value) => value + 1);
  };

  const goPrev = () => {
    if (currentIndex > 0) {
      setCurrentIndex((value) => value - 1);
    }
  };

  const progress = stage === "quiz" ? ((currentIndex + 1) / quizData.length) * 100 : 0;

  return (
    <main className="relative min-h-screen overflow-hidden px-4 py-8 text-bronze md:px-8 md:py-10">
      <div className="mx-auto max-w-6xl">
        <motion.header
          initial={{ opacity: 0, y: -12 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8 flex flex-col gap-3 md:mb-10"
        >
          <span className="font-body text-sm uppercase tracking-[0.36em] text-bronze/70">
            ZHBI
          </span>
          <div>
            <h1 className="font-display text-4xl leading-tight text-ink md:text-6xl">
              甄嬛传职场 ZHBI 测评
            </h1>
            <p className="mt-3 max-w-2xl font-body text-lg leading-8 text-ink/75">
              20 道题速测你在宫斗型职场里到底是黑莲花、活人微死，还是一句话就能把场子掀翻的高能狠人。
            </p>
          </div>
        </motion.header>

        <AnimatePresence mode="wait">
          {stage === "intro" && (
            <motion.section
              key="intro"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.45 }}
              className="grid gap-6 lg:grid-cols-[1.15fr_0.85fr]"
            >
              <div className="rounded-[2.4rem] border border-bronze/10 bg-white/60 p-8 shadow-card backdrop-blur md:p-10">
                <p className="font-body text-lg leading-8 text-ink/80">
                  20 道题带你测一遍自己在高压职场里的真实反应，从心机、驱动、疯感、自主到社交距离，最后匹配出最像你的《甄嬛传》角色，并生成一份带雷达图的宫斗型人格报告。
                </p>
                <div className="mt-8 flex flex-wrap gap-3">
                  {dimensionOrder.map((key) => (
                    <span
                      key={key}
                      className="rounded-full border border-bronze/15 bg-parchment/80 px-4 py-2 font-body text-sm text-ink"
                    >
                      {dimensionMeta[key].label}
                    </span>
                  ))}
                </div>
                <button
                  onClick={startQuiz}
                  className="mt-10 rounded-full bg-bronze px-7 py-3 font-display text-lg text-parchment transition hover:bg-ink"
                >
                  开始测评
                </button>
              </div>

              <div className="rounded-[2.4rem] border border-bronze/10 bg-gradient-to-br from-white/65 to-sand/70 p-8 shadow-card backdrop-blur">
                <p className="font-display text-xl text-ink">结果机制</p>
                <div className="mt-6 space-y-4 font-body text-base leading-7 text-ink/80">
                  <p>1. 每题四个选项都会给五维人格中的部分维度加减分。</p>
                  <p>2. 全部答完后，得到你的专属向量：S / M / V / A / D。</p>
                  <p>3. 系统将你的向量与 16 角色向量做最近邻匹配，挑出距离最近的角色。</p>
                </div>
                <div className="mt-8 rounded-[1.8rem] border border-bronze/10 bg-white/60 p-5">
                  <p className="font-display text-lg text-ink">分享文案</p>
                  <p className="mt-3 font-body text-lg text-wine">{shareCopy}</p>
                </div>
              </div>
            </motion.section>
          )}

          {stage === "quiz" && (
            <motion.section
              key="quiz"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="mx-auto max-w-5xl"
            >
              <div className="mb-6 overflow-hidden rounded-full bg-white/50">
                <motion.div
                  className="h-3 rounded-full bg-gradient-to-r from-wine to-bronze"
                  animate={{ width: `${progress}%` }}
                />
              </div>

              <QuestionCard
                question={quizData[currentIndex]}
                questionIndex={currentIndex}
                total={quizData.length}
                selectedIndex={answers[currentIndex]}
                onSelect={handleSelect}
              />

              <div className="mt-5 flex justify-between">
                <button
                  onClick={() => setStage("intro")}
                  className="rounded-full border border-bronze/15 bg-white/45 px-5 py-2 font-body text-ink/75 transition hover:bg-white/75"
                >
                  返回首页
                </button>
                <button
                  onClick={goPrev}
                  disabled={currentIndex === 0}
                  className="rounded-full border border-bronze/15 bg-white/45 px-5 py-2 font-body text-ink/75 transition hover:bg-white/75 disabled:cursor-not-allowed disabled:opacity-35"
                >
                  上一题
                </button>
              </div>
            </motion.section>
          )}

          {stage === "result" && (
            <motion.section
              key="result"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.45 }}
              className="grid gap-6 lg:grid-cols-[0.95fr_1.05fr]"
            >
              <div className="rounded-[2.4rem] border border-bronze/10 bg-white/65 p-7 shadow-card backdrop-blur md:p-8">
                <p className="font-body text-sm uppercase tracking-[0.3em] text-wine">
                  你的职场宫斗人格
                </p>
                <h2 className="mt-4 font-display text-5xl text-ink md:text-6xl">
                  {result.profile.name}
                </h2>

                <div className="mt-8 space-y-6">
                  <div>
                    <p className="font-display text-xl text-wine">Cute</p>
                    <p className="mt-2 font-body text-lg leading-8 text-ink/85">
                      {result.profile.cute}
                    </p>
                  </div>
                  <div>
                    <p className="font-display text-xl text-wine">Deep</p>
                    <p className="mt-2 font-body text-lg leading-8 text-ink/85">
                      {result.profile.deep}
                    </p>
                  </div>
                </div>

                <div className="mt-8 rounded-[1.8rem] border border-bronze/10 bg-parchment/65 p-5">
                  <p className="font-display text-xl text-ink">角色报告</p>
                  <p className="mt-3 font-body text-[1.02rem] leading-8 text-ink/80">
                    {result.profile.summary}
                  </p>
                </div>

                <div className="mt-8 grid grid-cols-2 gap-3 md:grid-cols-5">
                  {dimensionOrder.map((key) => (
                    <div
                      key={key}
                      className="rounded-[1.5rem] border border-bronze/10 bg-parchment/80 px-3 py-4 text-center"
                    >
                      <p className="font-display text-sm text-wine">{dimensionMeta[key].label}</p>
                      <p className="mt-2 font-display text-3xl text-ink">{result.score[key]}</p>
                    </div>
                  ))}
                </div>

                <div className="mt-8 flex flex-wrap gap-3">
                  <button
                    onClick={() => void downloadResultCard(result)}
                    className="rounded-full bg-bronze px-6 py-3 font-display text-parchment transition hover:bg-ink"
                  >
                    生成结果图片
                  </button>
                  <button
                    onClick={startQuiz}
                    className="rounded-full border border-bronze/20 bg-white/50 px-6 py-3 font-body text-ink transition hover:bg-white"
                  >
                    重新测试
                  </button>
                </div>
              </div>

              <div className="rounded-[2.4rem] border border-bronze/10 bg-gradient-to-br from-white/55 to-sand/70 p-6 shadow-card backdrop-blur md:p-8">
                <div className="mx-auto aspect-square max-w-[420px]">
                  <RadarChart values={result.normalizedScore} />
                </div>

                <div className="mt-6 grid gap-3 sm:grid-cols-2">
                  {dimensionOrder.map((key) => (
                    <div
                      key={key}
                      className="rounded-[1.4rem] border border-bronze/10 bg-white/60 px-4 py-4"
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-display text-lg text-ink">
                          {dimensionMeta[key].label}
                        </span>
                        <span className="font-body text-sm text-ink/60">
                          {dimensionMeta[key].subtitle}
                        </span>
                      </div>
                      <div className="mt-3 h-2 overflow-hidden rounded-full bg-bronze/10">
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: `${result.normalizedScore[key] * 10}%` }}
                          className="h-full rounded-full bg-gradient-to-r from-wine to-bronze"
                        />
                      </div>
                    </div>
                  ))}
                </div>

                <div className="mt-8 space-y-4">
                  <div className="rounded-[1.5rem] border border-bronze/10 bg-white/55 p-5">
                    <p className="font-display text-lg text-ink">你在职场里的伪装形态</p>
                    <p className="mt-2 font-body text-base leading-8 text-ink/80">
                      {result.profile.workplaceMask}
                    </p>
                  </div>
                  <div className="rounded-[1.5rem] border border-bronze/10 bg-white/55 p-5">
                    <p className="font-display text-lg text-ink">最容易失控的瞬间</p>
                    <p className="mt-2 font-body text-base leading-8 text-ink/80">
                      {result.profile.crashPoint}
                    </p>
                  </div>
                  <div className="rounded-[1.5rem] border border-bronze/10 bg-white/55 p-5">
                    <p className="font-display text-lg text-ink">续命建议</p>
                    <p className="mt-2 font-body text-base leading-8 text-ink/80">
                      {result.profile.survivalTip}
                    </p>
                  </div>
                </div>

                <p className="mt-8 text-center font-body text-lg text-wine">{shareCopy}</p>
              </div>
            </motion.section>
          )}
        </AnimatePresence>
      </div>
    </main>
  );
}
