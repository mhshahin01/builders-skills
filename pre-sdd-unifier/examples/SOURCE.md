# Source note: examples

Verbatim copies of the Examples README and its eight worked examples. They are worked examples, not templates, and their numbers are invented assumptions. Do not edit them. A problem found in an example goes in `ERRATA.md` in this folder, never into the copy. Where an example and the Standard disagree, the Standard wins (design document `docs/superpowers/specs/2026-10-23-pre-sdd-unifier-design.md`, section 2, item 7).

- Origin: `C:\Users\negat\Downloads\pre-sdd-preparation\<file name>` for each file below
- Copied: 2026-10-23T12:33:23Z (UTC), with `cp`, byte for byte
- Status: verbatim. No dash replacement, no line-ending change, no edit of any kind (decision Q1: keep copies byte for byte)
- Scope: only the nine files in the table. Any other file or folder here was written for the skill or is a separate copy: `studio-v2.2-export/` has its own `README.md`.

## Files

Path codes: GF greenfield, BF brownfield, OP on-prem, CL cloud. Recovery tier Simple: RPO and RTO both over 6 hours. Complex: both under 10 seconds for the stated fault scope.

| File | Role | Bytes | SHA-256 of the original | SHA-256 of the copy |
|---|---|---|---|---|
| `PreSDD_Examples_README.md` | Case index for the eight examples | 7085 | `31bd47933cdbf0ba914aa00327414852c319d63f651a89187bd25015b5d46fb1` | `31bd47933cdbf0ba914aa00327414852c319d63f651a89187bd25015b5d46fb1` |
| `PreSDD_GF_OP_Simple.md` | Greenfield, on-prem, Simple | 49714 | `5be1fe2d3d6c564d4bf270f9b222cdeb88a2c9f8701fedecb17e2b68e0980d91` | `5be1fe2d3d6c564d4bf270f9b222cdeb88a2c9f8701fedecb17e2b68e0980d91` |
| `PreSDD_GF_OP_Complex.md` | Greenfield, on-prem, Complex | 51921 | `752fc91d0ecaa6123b1cafd793fd100ac7e3363fcee6a413540c77a3a7b77335` | `752fc91d0ecaa6123b1cafd793fd100ac7e3363fcee6a413540c77a3a7b77335` |
| `PreSDD_GF_CL_Simple.md` | Greenfield, cloud, Simple | 49521 | `3c76153a64ee418c97b8287a4c32594879812dab6178dcb9a4c7469fea7041ad` | `3c76153a64ee418c97b8287a4c32594879812dab6178dcb9a4c7469fea7041ad` |
| `PreSDD_GF_CL_Complex.md` | Greenfield, cloud, Complex | 52664 | `409dbacb4bee8c85e869792b4c4cf8bba84af778851023b1786ccdaf0eb7bb8b` | `409dbacb4bee8c85e869792b4c4cf8bba84af778851023b1786ccdaf0eb7bb8b` |
| `PreSDD_BF_OP_Simple.md` | Brownfield, on-prem, Simple | 51222 | `eceadd8dcc42d10b9f2bb71995d99b22ca196834aa153e77fcbe482937fd8669` | `eceadd8dcc42d10b9f2bb71995d99b22ca196834aa153e77fcbe482937fd8669` |
| `PreSDD_BF_OP_Complex.md` | Brownfield, on-prem, Complex | 54205 | `611dee0bfe767e4b0e9910caec09b2b4fae7ef0ee77ca365106c00a08a124bdd` | `611dee0bfe767e4b0e9910caec09b2b4fae7ef0ee77ca365106c00a08a124bdd` |
| `PreSDD_BF_CL_Simple.md` | Brownfield, cloud, Simple (on-prem to AWS migration) | 56230 | `42845b75ac7d9470c9e705079d93513371e1b0ca062dc4b63b82ebcd50e9ab13` | `42845b75ac7d9470c9e705079d93513371e1b0ca062dc4b63b82ebcd50e9ab13` |
| `PreSDD_BF_CL_Complex.md` | Brownfield, cloud, Complex (Azure to Google Cloud migration) | 59918 | `83de7cf721d4b8c966e1be98601110b16ac6f6fad3e75cf3eb9590fffa90dede` | `83de7cf721d4b8c966e1be98601110b16ac6f6fad3e75cf3eb9590fffa90dede` |

Each copy is identical to its original, so the two hashes match. All nine files use LF line endings with no CR byte and no byte order mark, so each hash is the same over the raw bytes and over the LF-normalized bytes. A fresh Windows checkout writes CRLF (`core.autocrlf=true`), so any later check converts CRLF to LF before it hashes.

## Dashes

The copies keep the originals' em dashes (U+2014) and en dashes (U+2013): 649 em dashes and 8 en dashes across the nine files. Decision Q1 exempts these nine files from the dash scan. This note holds none.

## Known broken relative links

The examples were written to sit beside the Standard and the Intake Template in one flat folder. Two link targets no longer resolve from this folder. Both stay as they are in the copies.

| Link target, exactly as it appears | Now lives at | Occurrences |
|---|---|---|
| `./Pre-SDD_Architecture_Standard_v1.md` | `../reference/Pre-SDD_Architecture_Standard_v1.md` (replace the leading `./` with `../reference/`) | 17, in all nine files |
| `./Pre-SDD_Project_Intake_Template.md` | Left out by decision (design section 2, item 7). Not in this repository. The original stays in the origin folder. | 9, in all nine files |

Lines, per file:

| File | Lines with `./Pre-SDD_Architecture_Standard_v1.md` | Line with `./Pre-SDD_Project_Intake_Template.md` |
|---|---|---|
| `PreSDD_Examples_README.md` | 37 | 37 |
| `PreSDD_GF_OP_Simple.md` | 10, 161 | 10 |
| `PreSDD_GF_OP_Complex.md` | 10, 165 | 10 |
| `PreSDD_GF_CL_Simple.md` | 10, 163 | 10 |
| `PreSDD_GF_CL_Complex.md` | 10, 165 | 10 |
| `PreSDD_BF_OP_Simple.md` | 10, 161 | 10 |
| `PreSDD_BF_OP_Complex.md` | 10, 163 | 10 |
| `PreSDD_BF_CL_Simple.md` | 10, 164 | 10 |
| `PreSDD_BF_CL_Complex.md` | 10, 165 | 10 |

The other relative links still resolve, because their targets are in this folder: the README's links to the eight examples, and each example's link back to `./PreSDD_Examples_README.md` (line 10).

The Standard's own links into this folder are listed in `../reference/SOURCE.md`.
