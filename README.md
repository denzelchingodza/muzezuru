# Muzezuru

A conversational AI model fine tuned to understand and respond fluently in **Shona**, the primary language of Zimbabwe built from scratch on free tier compute, with no budget and no prior large scale model training experience.

> Named after the Zezuru, one of the main Shona sub groups (centered around Harare/Mashonaland) standard written Shona is itself based largely on the Zezuru dialect.

**Status: in active development.** This is not a finished product yet see [Progress](#progress) below for exactly where things stand.

## Why

Shona is a low resource language. Large models like GPT4, Claude, and Gemini have very limited Shona capability because there is very little Shona text in their training data compared to English, French, Spanish, or even Swahili leaving millions of Shona speakers effectively locked out of modern AI tools unless they use a second language.

Beyond the social angle, this project is a technical exploration of a genuinely hard problem: how do you fine tune a capable base model on a language it barely knows, with limited data and zero budget?

## Approach

- **Base model:** [BLOOMZ-3B](https://huggingface.co/bigscience/bloomz-3b) — chosen because Shona is explicitly one of the 46 languages in BLOOM's ROOTS pretraining corpus and BLOOMZ's xP3 instruction tuning data, unlike other multilingual candidates considered (Aya, InkubaLM) which don't include Shona at all.
- **Fine-tuning method:** [QLoRA](https://arxiv.org/abs/2305.14314) — 4bit quantization of the frozen base model + trainable LoRA adapters (rank 16, alpha 32, applied to all linear layers) the only way to fine tune a multi billion parameter model on a single free GPU.
- **Compute:** Google Colab and Kaggle Notebooks, free tiers only. No paid APIs, no dedicated hardware.
- **Training data:** primarily [`saillab/alpaca_shona_taco`](https://huggingface.co/datasets/saillab/alpaca_shona_taco) (Shona instruction/response pairs), supplemented by the Shona split of the [Aya Collection](https://huggingface.co/datasets/CohereForAI/aya_collection_language_split). See [Data quality notes](#data-quality-notes) for an important issue found and fixed in the primary dataset.

## Progress

- [x] Base model selected and justified
- [x] Data pipeline built (cleaning, deduplication, instruction format templating, train/val split)
- [x] First QLoRA fine tuning run completed (BLOOMZ-3B, 15k examples, 1 epoch)
- [x] **Data quality issue discovered and fixed:** see below
- [ ] Retraining and evaluating on cleaned data (in progress)
- [ ] Formal evaluation methodology for a low resource language with no standard benchmarks
- [ ] Hosting on Hugging Face Hub + Spaces demo
- [ ] Simple frontend
- [ ] Integration as a connector in a broader multilingual AI tool router (longer-term)

## Data quality notes

The first training run, while mechanically successful (training loss 2.62, validation loss 2.58), produced responses that echoed a broken pattern: `Instruction in English: ... Response in English: ... Response in Shona: ...` instead of directly answering in Shona in one case even substituting the wrong country entirely.

Investigation found that **84% of rows** (41,660 of 49,601) in `alpaca_shona_taco`'s `output` field contain exactly this English scaffolding baked in an artifact of whatever generation pipeline produced the dataset, apparently prompted to reason in three explicit steps (translate to English, answer in English, translate back to Shona) with the full raw output saved instead of just the final Shona answer.

Rather than discard 84% of the dataset, the fix extracts just the text following `Response in Shona:` for every affected row, recovering the underlying clean data. This is a useful reminder: **always manually inspect raw examples from a "ready to use" public dataset before trusting it.**

## License

- **BLOOMZ** is released under the BigScience RAIL license open, free, commercial use permitted, with only a restriction against harmful use.
- **`alpaca_shona_taco`** is CC BY-NC (non commercial/research use only), as it was translated from Alpaca-52k (originally generated via OpenAI's API). This project is a research/student portfolio effort and is compatible with that license; the dataset would need to be swapped for a commercial deployment.

## Author

Denzel Chingodza - software engineering student, South Africa.
