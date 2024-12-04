export const reactionEmojis: Record<
  string,
  { emojis: string[]; friendlyName: string }
> = {
  hkp: { emojis: ["🤗", "😘", "👊"], friendlyName: "Hug/Kiss/Punch" },
  lr: { emojis: ["⬅️", "➡️"], friendlyName: "Left or Right" },
  lmr: {
    emojis: ["⬅️", "🔄", "➡️"],
    friendlyName: "Left, Middle, or Right",
  },
  r1to5: {
    emojis: ["1️⃣", "2️⃣", "3️⃣", "4️⃣", "5️⃣"],
    friendlyName: "Rate 1 through 5",
  },
  r1to10: {
    emojis: ["1️⃣", "2️⃣", "3️⃣", "4️⃣", "5️⃣", "6️⃣", "7️⃣", "8️⃣", "9️⃣", "🔟"],
    friendlyName: "Rate 1 through 10",
  },
  updown: {
    emojis: ["⬆️", "⬇️"],
    friendlyName: "Upvote/Downvote",
  },
};
