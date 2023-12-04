#  Run with Python3! : python3 chris.py

cards = open("./input.txt", "r").readlines()
stack = []
cardHistory = {}
res = 0


def isWinningCard(card):
    # this function is the same as part1
    winningNums = set()
    winningCount = i = 0

    while card[i] != ":":
        i += 1

    while card[i] != "|":
        if card[i].isdigit():
            digit = ""
            while card[i].isdigit():
                digit += card[i]
                i += 1
            winningNums.add(digit)
        i += 1
    while i < len(card):
        if card[i].isdigit():
            digit = ""
            while i < len(card) and card[i].isdigit():
                digit += card[i]
                i += 1
            winningCount += 1 if digit in winningNums else 0
        i += 1
    return winningCount


for i, card in enumerate(cards):
    # find number of matches
    matchingNums = isWinningCard(card)
    res += 1
    matchedArr = []
    # add following card nums to matchedArr and stack
    for k in range(1, matchingNums + 1):
        stack.append(i + 1 + k)
        matchedArr.append(i + 1 + k)
    # add matchedArr to cardHistory
    cardHistory[i + 1] = matchedArr

# while stack exists pop from stack and add cardHistory values back to stack. Increment res by 1 each time.
while stack:
    cardWon = stack.pop()
    for c in cardHistory[cardWon]:
        stack.append(c)
    res += 1


print(res)
