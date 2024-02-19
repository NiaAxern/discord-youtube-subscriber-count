# Self-hostable YouTube Sub Notifier Bot
(This is my first time setting up an opensource repository so that other could read the code so im so sorry for the mess i have done lol)
[Test out the bot.](https://discord.com/api/oauth2/authorize?client_id=1209052576197115934&permissions=536923200&scope=bot+applications.commands)

To install dependencies:

```bash
bun install
```

To run:

```bash
bun dev
```
(for dev)

```bash
bun start
```
(for production)

Files:
```
├── LICENSE
├── README.md
├── config.ts
├── eslint.config.js
├── package.json
├── src
│   ├── client.ts
│   ├── commands
│   │   └── utilities.ts
│   ├── commands.ts
│   ├── events
│   │   ├── chatCommands.ts
│   │   └── ready.ts
│   ├── index.ts
│   ├── logging.ts
│   └── types
│       └── commands.d.ts
└── tsconfig.json
```
`events` has Discord.JS events like interactionCreate (for each application command event type (chatInput, ...etc)) and clientReady here.

`commands` is a categorized folder full off commands like **ping** *(utilities.ts)* that the bot will read when its initializing. 

`types` is types for things that needs types. Right now when I'm writing this there is only **commands.d.ts** which is just types for the **commands** folder and the commands inside it so that the *command* initializer can get the right types.



btw, this project was created using `bun init` in bun v1.0.27. [Bun](https://bun.sh) is a fast all-in-one JavaScript runtime.