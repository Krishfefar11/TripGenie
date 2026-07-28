# RAG Retrieval Evaluation

Corpus: 6 documents (bali-guide.txt, paris-guide.txt, tokyo-guide.txt, bangkok-guide.txt, new-york-guide.txt, rome-guide.txt), 18 labeled test queries, top-5 retrieval.

| Query | Baseline P@5 | Hybrid+Rerank P@5 | Baseline R@5 | Hybrid+Rerank R@5 | Baseline MRR | Hybrid+Rerank MRR |
|---|---|---|---|---|---|---|
| affordable Balinese food Nasi Goreng Babi Guling | 20.0% | 20.0% | 100.0% | 100.0% | 1.00 | 1.00 |
| Eiffel Tower Louvre Mona Lisa must see | 20.0% | 20.0% | 100.0% | 100.0% | 1.00 | 1.00 |
| colorful quiet street away from crowds hidden gem in Paris | 20.0% | 20.0% | 100.0% | 100.0% | 1.00 | 1.00 |
| Reclining Buddha Wat Pho massage school | 20.0% | 20.0% | 100.0% | 100.0% | 1.00 | 0.50 |
| Pad Thai Tom Yum Goong street cart food | 20.0% | 20.0% | 100.0% | 100.0% | 1.00 | 1.00 |
| Cacio e Pepe Carbonara pasta dish | 20.0% | 20.0% | 100.0% | 100.0% | 1.00 | 1.00 |
| keyhole view St Peter's dome Aventine Hill | 40.0% | 40.0% | 100.0% | 100.0% | 1.00 | 1.00 |
| bagels lox pastrami Katz deli | 20.0% | 20.0% | 100.0% | 100.0% | 0.50 | 1.00 |
| High Line elevated park Chelsea | 20.0% | 20.0% | 100.0% | 100.0% | 1.00 | 1.00 |
| capsule hotel budget backpacker Tokyo | 40.0% | 40.0% | 100.0% | 100.0% | 1.00 | 1.00 |
| ramen sushi izakaya yakitori | 20.0% | 20.0% | 100.0% | 100.0% | 1.00 | 1.00 |
| Shibuya crossing Meiji Shrine Harajuku | 20.0% | 20.0% | 100.0% | 100.0% | 1.00 | 1.00 |
| surfing diving yoga retreat Ubud activities | 20.0% | 20.0% | 100.0% | 100.0% | 1.00 | 1.00 |
| Broadway Times Square Central Park attractions | 20.0% | 20.0% | 100.0% | 100.0% | 0.50 | 1.00 |
| Colosseum Roman Forum Vatican skip the line | 20.0% | 20.0% | 100.0% | 100.0% | 1.00 | 1.00 |
| Muay Thai boxing floating market day trip | 20.0% | 20.0% | 100.0% | 100.0% | 1.00 | 1.00 |
| museum pass free Sunday budget tips Paris | 20.0% | 20.0% | 100.0% | 100.0% | 1.00 | 1.00 |
| scooter rental Grab Gojek getting around Bali | 20.0% | 20.0% | 100.0% | 100.0% | 1.00 | 1.00 |

## Summary (averaged over 18 queries)

| Metric | Baseline (vector-only) | Hybrid + Rerank | Delta |
|---|---|---|---|
| Precision@5 | 22.2% | 22.2% | 0.0% |
| Recall@5 | 100.0% | 100.0% | 0.0% |
| MRR@5 | 0.944 | 0.972 | 0.028 |
