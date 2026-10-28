# Source note: reference

Verbatim copies of two method sources. Do not edit them. The skill's own rule files distill them. When the two disagree, the Standard wins (design document `docs/superpowers/specs/2026-10-23-pre-sdd-unifier-design.md`, section 2, item 7).

- Origin: `C:\Users\negat\Downloads\pre-sdd-preparation\<file name>` for each file below
- Copied: 2026-10-23T12:33:23Z (UTC), with `cp`, byte for byte
- Status: verbatim. No dash replacement, no line-ending change, no edit of any kind (decision Q1: keep copies byte for byte)
- Scope: only the files in the table. Any other file in this folder was written for the skill, not copied.

## Files

| File | Role | Bytes | SHA-256 of the original | SHA-256 of the copy |
|---|---|---|---|---|
| `Pre-SDD_Architecture_Standard_v1.md` | The Standard, the full Pre-SDD | 68666 | `d10ee12527febd4cc6e836f89206386395a77489161c345cae85aac0891df126` | `d10ee12527febd4cc6e836f89206386395a77489161c345cae85aac0891df126` |
| `Pre-SDD_Quick_Discovery_Guide.md` | The Quick Discovery Guide, the first discovery conversation | 12412 | `49cb19e00c9facc1a4d5027d7e355075f4d03de06d569949f49834c6e578a09e` | `49cb19e00c9facc1a4d5027d7e355075f4d03de06d569949f49834c6e578a09e` |

Each copy is identical to its original, so the two hashes match. Both files use LF line endings with no CR byte and no byte order mark, so each hash is the same over the raw bytes and over the LF-normalized bytes. A fresh Windows checkout writes CRLF (`core.autocrlf=true`), so any later check converts CRLF to LF before it hashes.

## Dashes

The copies keep the originals' em dashes (U+2014) and en dashes (U+2013): 23 em dashes and 3 en dashes across the two files. Decision Q1 exempts these two files from the dash scan. This note holds none.

## Known broken relative links

The originals sat in one flat folder. The worked examples now live in `../examples/`, so the nine links below no longer resolve from this folder. They stay as they are in the copy. To follow one, replace its leading `./` with `../examples/`.

All nine are in section 16 of the Standard, "Worked-example library".

| Link target, exactly as it appears | Line in the Standard | Now lives at |
|---|---|---|
| `./PreSDD_Examples_README.md` | 675 | `../examples/PreSDD_Examples_README.md` |
| `./PreSDD_GF_OP_Simple.md` | 679 | `../examples/PreSDD_GF_OP_Simple.md` |
| `./PreSDD_GF_OP_Complex.md` | 679 | `../examples/PreSDD_GF_OP_Complex.md` |
| `./PreSDD_GF_CL_Simple.md` | 680 | `../examples/PreSDD_GF_CL_Simple.md` |
| `./PreSDD_GF_CL_Complex.md` | 680 | `../examples/PreSDD_GF_CL_Complex.md` |
| `./PreSDD_BF_OP_Simple.md` | 681 | `../examples/PreSDD_BF_OP_Simple.md` |
| `./PreSDD_BF_OP_Complex.md` | 681 | `../examples/PreSDD_BF_OP_Complex.md` |
| `./PreSDD_BF_CL_Simple.md` | 682 | `../examples/PreSDD_BF_CL_Simple.md` |
| `./PreSDD_BF_CL_Complex.md` | 682 | `../examples/PreSDD_BF_CL_Complex.md` |

The two links in the Quick Discovery Guide, `./Pre-SDD_Architecture_Standard_v1.md` (lines 5 and 215), still resolve, because the Standard is in this folder too.

No link in either file points at the Project Intake Template (`Pre-SDD_Project_Intake_Template.md`), which was left out by decision (design section 2, item 7).
