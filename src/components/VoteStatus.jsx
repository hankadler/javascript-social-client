import PropTypes from "prop-types";
import { useEffect, useRef, useState } from "react";
import { v4 } from "uuid";
import {
  BarChart,
  Bar,
  Cell,
  XAxis,
  YAxis,
  Tooltip,
  ReferenceLine,
  ResponsiveContainer,
} from "recharts";
import * as css from "../styles/VoteStatus.module.css";

const propTypes = {
  votes: PropTypes.instanceOf(Array).isRequired
};

export default function VoteStatus({ votes }) {
  const mounted = useRef(false);
  const [goodCount, setGoodCount] = useState(0);
  const [trueCount, setTrueCount] = useState(0);
  const [rightCount, setRightCount] = useState(0);
  const [badCount, setBadCount] = useState(0);
  const [falseCount, setFalseCount] = useState(0);
  const [wrongCount, setWrongCount] = useState(0);
  const [hasCounted, setHasCounted] = useState(false);
  const [data, setData] = useState([]);
  const [maxCount, setMaxCount] = useState(0);

  const toPct = (count) => Math.round((count / votes.length) * 100);

  useEffect(() => {
    votes.forEach(({ why }) => {
      switch (why) {
        case "Good":
          setGoodCount(goodCount + 1);
          break;
        case "True":
          setTrueCount(trueCount + 1);
          break;
        case "Right":
          setRightCount(rightCount + 1);
          break;
        case "Bad":
          setBadCount(badCount + 1);
          break;
        case "False":
          setFalseCount(falseCount + 1);
          break;
        case "Wrong":
          setWrongCount(wrongCount + 1);
          break;
        default:
          break;
      }
    });
    setHasCounted(true);
    mounted.current = true;
  }, []);

  useEffect(() => {
    if (mounted.current) {
      setData([
        {
          why: "Good",
          count: goodCount,
          pct: toPct(goodCount)
        },
        {
          why: "True",
          count: trueCount,
          pct: toPct(trueCount)
        },
        {
          why: "Right",
          count: rightCount,
          pct: toPct(rightCount)
        },
        {
          why: "Bad",
          count: badCount,
          pct: toPct(badCount)
        },
        {
          why: "False",
          count: falseCount,
          pct: toPct(falseCount)
        },
        {
          why: "Wrong",
          count: wrongCount,
          pct: toPct(wrongCount)
        }
      ]);
    }
    setMaxCount(Math.max(goodCount, trueCount, rightCount, badCount, falseCount, wrongCount));
  }, [hasCounted]);

  return mounted.current ? (
    <div className={css.VoteStatus}>
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          width={320}
          height={160}
          data={data}
          barGap={0}
          margin={{ top: 0, right: 0, bottom: 0, left: 0 }}
          fontSize=".9em"
        >
          {/* <CartesianGrid strokeDasharray="3 3" /> */}
          <XAxis dataKey="why" />
          <YAxis tickCount={maxCount > 1 ? 5 : 1} />
          <Tooltip />
          <ReferenceLine y={0} stroke="#000" />
          <Bar dataKey="count" fill="#8884d8">
            {data.map((entry, index) => (
              <Cell key={v4()} fill={index < 3 ? "#0f0" : "#f00"} fillOpacity={0.5} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  ) : null;
}

VoteStatus.propTypes = propTypes;
