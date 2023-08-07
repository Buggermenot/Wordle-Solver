# Word Ordering

with open ("words.txt", "r") as wf:
        words = [x.rstrip('\n') for x in wf.readlines()]

letters = dict()
for word in words:
        ls = set(word)
        for letter in ls:
                try:
                        letters[letter] += 1
                except:
                        letters[letter] = 1

letters = {k: v for k, v in sorted(letters.items(), key=lambda item: item[1], reverse=True)}
for letter, count in letters.items():
        print(letter, count)

scores = [dict(), dict(), dict(), dict(), dict()]

for word in words:
        ls = set(word)
        sc = 0
        for letter in ls:
                sc += letters[letter]
        scores[len(ls) - 1][word] = sc

for i in range(5):
        scores[i] = {k: v for k, v in sorted(scores[i].items(), key=lambda item: item[1], reverse=True)}
scores = scores[::-1]

ordered_words = []

for i in range(5):
        for word, score in scores[i].items():
                ordered_words.append(word + "\n")
                # print(word, score)

# print(ordered_words)
with open("words.txt", 'w') as wf:
        wf.writelines(ordered_words)

# print(ordered_words[:10])