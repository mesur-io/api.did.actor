// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";

import { provePresentation } from "../../../vc-api";

type VerifiablePresentation = any;

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<VerifiablePresentation>
) {
  const { presentation, options } = req.body;
  const { mnemonic, hdpath } = req.headers;
  const proofType = options.type || "Ed25519Signature2018";
  const format = options.type === "jwt_vp" ? "vp-jwt" : "vp";
  try {
    const verifiablePresentation = await provePresentation({
      presentation,
      options,
      mnemonic,
      hdpath,
      proofType,
      format,
    });
    res.status(200).json(verifiablePresentation);
  } catch (e) {
    res.status(500).json({ message: (e as any).message });
  }
}
