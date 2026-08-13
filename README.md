# Muzezuru

A conversational AI model fine tuned to understand and respond fluently in Shona, the primary language of Zimbabwe. Built from scratch on free tier compute, with no budget and no prior large scale model training experience.

Named after the Zezuru, one of the main Shona sub groups, centered around Harare and Mashonaland. Standard written Shona is itself based largely on the Zezuru dialect.

Status: in active development. This is not a finished product. See Limitations and Progress below for exactly where things stand and why.

## Why this project exists

Shona is a low resource language. Large models like GPT4, Claude, and Gemini have very limited Shona ability because there is very little Shona text in their training data compared to English, French, Spanish, or even Swahili. This leaves millions of Shona speakers effectively locked out of modern AI tools unless they switch to a second language.

Beyond that, this project is a technical exploration of a genuinely hard problem. How do you fine tune a capable base model on a language it barely knows, with limited data and zero budget? The honest answer is that you can, but only partly, and understanding exactly what you can and can't fix this way is the real lesson of this project.

## Limitations, and why they exist

Muzezuru hallucinates. It sometimes gives fluent, confident answers in Shona that are simply wrong, especially for factual questions like Zimbabwean geography, currency, or specific instructions. This is a known, tested, and expected limitation, not a bug that slipped through. Here is why it happens.

**The base model never learned many Shona facts in the first place.** BLOOMZ, the model this project fine tunes, was trained on many languages including Shona, but the amount of Shona text it saw was still small compared to English. It picked up grammar and general fluency, but it never had much chance to learn specific facts stated in Shona, such as the name of Zimbabwe's capital city or its currency.

**Fine tuning mostly teaches style, not new facts.** The technique used here, QLoRA, is very efficient. It freezes almost the entire model and only trains a small set of extra parameters on top. This is what makes it possible to fine tune a multi billion parameter model on a single free GPU. But that efficiency comes at a cost. A small number of trainable parameters, trained for a single pass over a modest dataset, is well suited to teaching a model how to sound fluent and how to follow instructions. It is not well suited to teaching a model brand new facts it never saw during its original training.

**The training data leaned conceptual, not factual.** The instruction data used to fine tune Muzezuru is strong on general conversation and philosophical topics, and comparatively thin on verified factual content about Zimbabwe specifically. The model was rarely shown a correct answer to memorize for these factual questions, so when asked one, it does what language models do when they are uncertain. It produces something that sounds plausible and fluent rather than admitting it does not know.

Put simply, this project proved that a fluent, custom Shona conversational model can be built for free. It also proved that fluency and factual accuracy are two separate problems, and that fixing the second one needs a different kind of effort: curated factual training data, a larger base model, more training time, or explicit training on when to say "I don't know" instead of guessing. None of that was in scope for this zero budget, first attempt version.

## What this project is actually for

This was built primarily as a learning project, to understand the full pipeline of building a language model from data collection through to a live product, not to produce a finished, production ready assistant on a zero budget setup. That goal was met. The next step, now that the pipeline works end to end, is to apply the same process to future models with a specific focus on precision and factual reliability, using better curated data and more compute where it becomes available. Muzezuru is the working proof that the pipeline holds together. The models after it are where the factual accuracy work happens.

## Technology used

* Base model: BLOOMZ 3B (bigscience/bloomz-3b on Hugging Face), chosen because Shona is one of its original training languages, unlike other multilingual alternatives considered such as Aya or InkubaLM
* Fine tuning method: QLoRA, meaning 4 bit quantization of the frozen base model plus small trainable LoRA adapters, the only realistic way to fine tune a multi billion parameter model on a single free GPU
* Training libraries: Hugging Face transformers, peft, bitsandbytes, and datasets
* Compute: Google Colab and Kaggle notebooks, free tiers only, no paid APIs or dedicated hardware
* Training data: primarily saillab/alpaca_shona_taco, a set of Shona instruction and response pairs, supplemented by the Shona portion of the Aya Collection
* Hosting: the trained model lives on the Hugging Face Hub, with a live chat demo on Hugging Face Spaces (Gradio, running on the free ZeroGPU tier)
* Frontend: a custom chat interface built with Next.js, deployed for free on Vercel, calling the Hugging Face Space directly with no separate backend server

## Progress

* [x] Base model selected and justified
* [x] Data pipeline built (cleaning, deduplication, instruction format templating, train and validation split)
* [x] First QLoRA fine tuning run completed (BLOOMZ 3B, 15,000 examples, 1 epoch)
* [x] Data quality issue discovered and fixed, see below
* [x] Retraining and evaluating on cleaned data
* [x] Formal evaluation methodology for a low resource language with no standard benchmarks (a 15 prompt scorecard across 7 categories)
* [x] Hosting on Hugging Face Hub and Spaces demo, live at huggingface.co/spaces/denzelchingodza/muzezuru
* [x] Frontend, see below
* [ ] A future model trained specifically for factual precision, using curated Zimbabwean fact data
* [ ] Integration as a connector in a broader multilingual AI tool router (longer term)

## Data quality notes

The first training run, while mechanically successful (training loss 2.62, validation loss 2.58), produced responses that echoed a broken pattern in the output text: "Instruction in English, Response in English, Response in Shona" instead of just answering directly in Shona. In one case it even substituted the wrong country entirely.

Investigation found that 84 percent of rows, 41,660 out of 49,601, in the alpaca_shona_taco dataset's output field contained exactly this English scaffolding baked into the text. It was an artifact of whatever generation pipeline produced the dataset, which appears to have been prompted to reason in three explicit steps (translate to English, answer in English, translate back to Shona), with the full raw output saved instead of just the final Shona answer.

Rather than discard 84 percent of the dataset, the fix extracts just the text following "Response in Shona:" for every affected row, recovering the clean data underneath. The lesson here is a simple one: always manually inspect raw examples from a "ready to use" public dataset before trusting it.

## Frontend

A Zimbabwe flag themed chat interface, built with Next.js, that talks directly to the live Hugging Face Space with no separate backend. It includes a green, gold, and red accent strip, a hero greeting that opens into a chat thread, suggested Shona prompts, dark mode by default, and a sidebar that saves your chat history locally in the browser.

To run it locally:

```bash
npm install
npm run dev
```

Then open http://localhost:3000. To deploy it for free, import this repository on vercel.com, which auto detects Next.js with no extra configuration needed.

The constant `CHAT_API_NAME` in `app/page.js` is set to `/respond`, matching the Space's live API. If the Space is ever rebuilt with a different function name, check "Use via API" on the Space's page and update that constant to match.

## License

* BLOOMZ is released under the BigScience RAIL license: open, free, and commercial use is permitted, with only a restriction against harmful use.
* alpaca_shona_taco is CC BY NC, meaning non commercial and research use only, since it was translated from Alpaca 52k, which was originally generated using OpenAI's API. This project is a research and student portfolio effort and is compatible with that license. The dataset would need to be swapped out for any commercial deployment.

## Author

Denzel Chingodza, software engineering student, South Africa.
