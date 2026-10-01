import re
import sys

PATH = sys.argv[1]

LINKS = {
    "REFUNDS/UC-01": "../brd-refunds-portal/06a-use-cases-customer.md#uc-01-request-a-refund",
    "REFUNDS/UC-02": "../brd-refunds-portal/06a-use-cases-customer.md#uc-02-track-refund-status-web-and-mobile",
    "REFUNDS/UC-03": "../brd-refunds-portal/06a-use-cases-customer.md#uc-03-cancel-a-refund-request",
    "REFUNDS/UC-04": "../brd-refunds-portal/06b-use-cases-branch-manager.md#uc-04-approve--reject-refund",
    "REFUNDS/UC-05": "../brd-refunds-portal/05-user-journeys-overview.md#use-case-summary",
    "LOYALTY/UC-01": "../brd-loyalty-points/06a-use-cases-member.md#uc-01-view-points-balance",
    "LOYALTY/UC-02": "../brd-loyalty-points/06a-use-cases-member.md#uc-02-view-points-history",
}

PAT = re.compile(r"(?<!\[)\b((?:REFUNDS|LOYALTY)/UC-\d\d)\b(?!\]\()")


def main():
    with open(PATH, encoding="utf-8") as f:
        lines = f.read().split("\n")
    out = []
    in_fence = False
    count = 0
    for line in lines:
        if line.strip().startswith("```"):
            in_fence = not in_fence
            out.append(line)
            continue
        if in_fence:
            out.append(line)
            continue
        parts = line.split("`")
        for i in range(0, len(parts), 2):
            parts[i], n = PAT.subn(lambda m: f"[{m.group(1)}]({LINKS[m.group(1)]})", parts[i])
            count += n
        out.append("`".join(parts))
    with open(PATH, "w", encoding="utf-8", newline="\n") as f:
        f.write("\n".join(out))
    print("linked", count)


main()
