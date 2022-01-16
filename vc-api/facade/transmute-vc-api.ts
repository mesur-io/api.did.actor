import {
  Ed25519VerificationKey2018,
  Ed25519Signature2018,
} from "@transmute/ed25519-signature-2018";

export { Ed25519VerificationKey2018, Ed25519Signature2018 };
import { verifiable } from "@transmute/vc.js";
import { checkStatus } from "@transmute/vc-status-rl-2020";

import { getCredentialSuite } from "../getCredentialSuite";
import { getPresentationSuite } from "../getPresentationSuite";
import { documentLoader } from "../../core/documentLoader";

export const DOCUMENT_LOADER_TYPE = "resolver";
import { JsonWebSignature } from "@transmute/json-web-signature";

export const suite = [new Ed25519Signature2018(), new JsonWebSignature()];

export const issueCredential = async ({
  credential,
  mnemonic,
  hdpath,
}: any) => {
  const suite = await getCredentialSuite({ credential, mnemonic, hdpath });
  const { items } = await verifiable.credential.create({
    credential,
    suite,
    documentLoader,
    format: ["vc"],
  });
  return items[0];
};

export const provePresentation = async ({
  presentation,
  options,
  mnemonic,
  hdpath,
}: any) => {
  const suite = await getPresentationSuite({ presentation, mnemonic, hdpath });
  const { items } = await verifiable.presentation.create({
    presentation,
    domain:
      options.domain === "" || options.domain === undefined
        ? undefined
        : options.domain,
    challenge: options.challenge,
    suite,
    format: ["vp"],
    documentLoader,
  });
  return items[0];
};

export const verifyCredential = async ({ verifiableCredential }: any) => {
  const verification = await verifiable.credential.verify({
    credential: verifiableCredential,
    suite,
    checkStatus,
    format: ["vc"],
    documentLoader,
  });
  console.log(verification);
  return verification;
};

export const verifyPresentation = async ({
  verifiablePresentation,
  options,
}: any) => {
  const result = await verifiable.presentation.verify({
    presentation: verifiablePresentation,
    domain: options.domain,
    challenge: options.challenge,
    suite,
    checkStatus,
    format: ["vp"],
    documentLoader,
  } as any);
  return result;
};
