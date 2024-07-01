import { z } from "zod";
import referralsParser from "../../../config/db/parsers/referrals-parser";

export type Referral = z.infer<typeof referralsParser.selectSchema>;
export type ReferralDTO = z.infer<typeof referralsParser.insertSchema>;
