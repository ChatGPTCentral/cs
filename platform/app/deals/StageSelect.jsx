"use client";

import { useRef } from "react";
import { updateDealStage } from "./actions";
import { DEAL_STAGES } from "./stages";
import SaveWatcher from "../people/SaveWatcher";

const LABEL = {
  waiting: "Waiting on their reply",
  decision: "Needs your call",
  blocked: "Blocked - missing info",
  dormant: "Dormant - new angle",
  affiliate: "Affiliate programs",
};

// Same spreadsheet-cell pattern as TableCellInput (form + server action,
// auto-submit, SaveWatcher for the toast) but for a <select> - moves a
// card to another column on change instead of on blur.
export default function StageSelect({ id, stage }) {
  const formRef = useRef(null);

  return (
    <form ref={formRef} action={updateDealStage} className="deals-stage-form">
      <input type="hidden" name="id" value={id} />
      <select
        name="deal_stage"
        defaultValue={stage}
        className="deals-stage-select"
        onChange={() => formRef.current?.requestSubmit()}
      >
        {DEAL_STAGES.map((s) => (
          <option key={s} value={s}>
            {LABEL[s]}
          </option>
        ))}
      </select>
      <SaveWatcher />
    </form>
  );
}
