# Changelog

All notable changes to this project will be documented in this file. See [standard-version](https://github.com/conventional-changelog/standard-version) for commit guidelines.

### 0.0.45 (2022-04-07)

### Features

- expose PomelloService and Ticker types ([#45](https://github.com/brrian/pomello-service/issues/45)) ([ab2020d](https://github.com/brrian/pomello-service/commit/ab2020d16cc2fce64528f748ea5d0d76ea46f498))

### 0.0.44 (2022-03-13)

### 0.0.43 (2022-03-12)

### Bug Fixes

- only log timerStart if timer available ([#43](https://github.com/brrian/pomello-service/issues/43)) ([923629d](https://github.com/brrian/pomello-service/commit/923629d0d38ecd1dbc9ac3e9f08a89e87cf969ab))

### 0.0.42 (2022-03-11)

### Features

- account for grace period in taskSelect event ([#42](https://github.com/brrian/pomello-service/issues/42)) ([c854b3e](https://github.com/brrian/pomello-service/commit/c854b3e2ef0f4529a7d0cd7a7303f8054090fe11))

### 0.0.41 (2022-03-10)

### Features

- add taskId to overtime context ([#41](https://github.com/brrian/pomello-service/issues/41)) ([67fad8c](https://github.com/brrian/pomello-service/commit/67fad8ced99ada8ad1b085f33020afa2930da3b4))

### 0.0.40 (2022-03-09)

### Bug Fixes

- autostart new timers after handling task complete ([#40](https://github.com/brrian/pomello-service/issues/40)) ([3c7cc08](https://github.com/brrian/pomello-service/commit/3c7cc08f493b720faacd9e53f64b32be793a266d))

### 0.0.39 (2022-03-08)

### Features

- fix event timer data for task void events ([#39](https://github.com/brrian/pomello-service/issues/39)) ([cbcc821](https://github.com/brrian/pomello-service/commit/cbcc8217088c76b29a39f54f1eff1d41759a4e61))

### 0.0.38 (2022-03-08)

### 0.0.37 (2022-03-07)

### 0.0.36 (2022-03-06)

### Features

- log taskEnd event when completing tasks ([#35](https://github.com/brrian/pomello-service/issues/35)) ([2f1de0f](https://github.com/brrian/pomello-service/commit/2f1de0f15f87f91586597bf061325fa02f19b26b))

### 0.0.35 (2022-03-06)

### Bug Fixes

- use correct start time for overtimeStart event ([#34](https://github.com/brrian/pomello-service/issues/34)) ([5374a30](https://github.com/brrian/pomello-service/commit/5374a305a67bff13abe6ddf7e20855e1316a0ae5))

### 0.0.34 (2022-03-06)

### Features

- update order for task select event ([#33](https://github.com/brrian/pomello-service/issues/33)) ([61c7434](https://github.com/brrian/pomello-service/commit/61c7434ec4b998ed3a9bb1d2ab6cbee33274e66d))

### 0.0.33 (2022-03-05)

### 0.0.32 (2022-03-05)

### Features

- prevent transition in taskCompletedPrompt state ([#31](https://github.com/brrian/pomello-service/issues/31)) ([071f8a5](https://github.com/brrian/pomello-service/commit/071f8a5c90e01d57fb392a9f8f6b4cd18d48de22))

### 0.0.31 (2022-03-05)

### Bug Fixes

- swap out setImmediate for setTimeout ([#30](https://github.com/brrian/pomello-service/issues/30)) ([72e3a86](https://github.com/brrian/pomello-service/commit/72e3a860e78af78889b308ce6a5e2095dcca8752))

### 0.0.30 (2022-03-04)

### Features

- add between tasks grace period handling ([#29](https://github.com/brrian/pomello-service/issues/29)) ([0d7b6da](https://github.com/brrian/pomello-service/commit/0d7b6da0e5071e03a986942e12eb6da62f0e9637))

### 0.0.29 (2022-03-03)

### Features

- consolidate task timer end actions ([#28](https://github.com/brrian/pomello-service/issues/28)) ([368e1d3](https://github.com/brrian/pomello-service/commit/368e1d3024c1af23fc6c31715ee1c6ea0142eb40))

### 0.0.28 (2022-03-03)

### Features

- add update settings method ([#27](https://github.com/brrian/pomello-service/issues/27)) ([f7f9e8f](https://github.com/brrian/pomello-service/commit/f7f9e8f4294499ae5a13ef91d2bab6cb863116b7))

### 0.0.27 (2022-03-02)

### 0.0.26 (2022-03-02)

### Features

- add task start and end events ([#25](https://github.com/brrian/pomello-service/issues/25)) ([e756a31](https://github.com/brrian/pomello-service/commit/e756a310de46899373c73c79ce7de581ee113460))

### 0.0.25 (2022-03-01)

### Features

- add overtime events ([#24](https://github.com/brrian/pomello-service/issues/24)) ([64dbc4b](https://github.com/brrian/pomello-service/commit/64dbc4b81ad416db729ec010fc62373535e75862))

### 0.0.24 (2022-02-28)

### Features

- add overtime tick handling ([#23](https://github.com/brrian/pomello-service/issues/23)) ([ef5ede5](https://github.com/brrian/pomello-service/commit/ef5ede511977476eff8612d15cf44efa363c255b))

### 0.0.23 (2022-02-28)

### Features

- add overtime end handling ([#22](https://github.com/brrian/pomello-service/issues/22)) ([8e6a3a5](https://github.com/brrian/pomello-service/commit/8e6a3a565d00635e80502e76d61887785857fd15))

### 0.0.22 (2022-02-27)

### 0.0.21 (2022-02-27)

### Features

- initialize overtime service ([#20](https://github.com/brrian/pomello-service/issues/20)) ([a4faa34](https://github.com/brrian/pomello-service/commit/a4faa34e909c198b5752cb0dc4e37507848943e9))

### 0.0.20 (2022-02-27)

### 0.0.19 (2022-02-27)

### Features

- update timer events payload ([#18](https://github.com/brrian/pomello-service/issues/18)) ([69432d7](https://github.com/brrian/pomello-service/commit/69432d7666bf9fde0411f75be3ca5651e3c27836))

### 0.0.18 (2022-02-26)

### Features

- update task events payload ([#17](https://github.com/brrian/pomello-service/issues/17)) ([d2162df](https://github.com/brrian/pomello-service/commit/d2162df3fe08e1c6b275ec15d199b02f674aff61))

### 0.0.17 (2022-02-26)

### Features

- align complete task naming ([#16](https://github.com/brrian/pomello-service/issues/16)) ([a9a536a](https://github.com/brrian/pomello-service/commit/a9a536a8fb2c6836db42530a769f061ff0aa4ddb))

### 0.0.16 (2022-02-26)

### Features

- add void task handling ([#15](https://github.com/brrian/pomello-service/issues/15)) ([4a3d3c6](https://github.com/brrian/pomello-service/commit/4a3d3c62b785e5a5dbbe1117db6ee14d0ea9f514))

### 0.0.15 (2022-02-26)

### Features

- add complete task handling ([#14](https://github.com/brrian/pomello-service/issues/14)) ([99aacbb](https://github.com/brrian/pomello-service/commit/99aacbb4672d76d850aed4d4927d0b2478ac6334))

### 0.0.14 (2022-02-25)

### Features

- add skip timer handling ([#13](https://github.com/brrian/pomello-service/issues/13)) ([6ac2ddc](https://github.com/brrian/pomello-service/commit/6ac2ddc9cd358b9a39c846f0510199d3e567b46c))

### 0.0.13 (2022-02-24)

### Features

- add switch task handling ([#12](https://github.com/brrian/pomello-service/issues/12)) ([b071d0d](https://github.com/brrian/pomello-service/commit/b071d0d56ce8eec7410fb2f6633b0ae4a2527a42))

### 0.0.12 (2022-02-24)

### 0.0.11 (2022-02-24)

### Features

- add long break handling ([#10](https://github.com/brrian/pomello-service/issues/10)) ([d3d4731](https://github.com/brrian/pomello-service/commit/d3d4731a8437011d329913a892b8e56588ba7555))

### 0.0.10 (2022-02-24)

### Features

- add select new task method ([#9](https://github.com/brrian/pomello-service/issues/9)) ([db94fec](https://github.com/brrian/pomello-service/commit/db94fece86ba3a742b597b4a10af1f5b462a6007))

### 0.0.9 (2022-02-23)

### 0.0.8 (2022-02-23)

### 0.0.7 (2022-02-22)

### Features

- batch update events together ([#6](https://github.com/brrian/pomello-service/issues/6)) ([3c0b199](https://github.com/brrian/pomello-service/commit/3c0b19973ceb4dab11a5b12e8cbe4a9e316fb9b0))

### 0.0.6 (2022-02-22)

### Features

- add auto start timer handling ([#5](https://github.com/brrian/pomello-service/issues/5)) ([55de48e](https://github.com/brrian/pomello-service/commit/55de48e9288acd7535dc5d981dd18ccf171b5e57))

### 0.0.5 (2022-02-21)

### Features

- add short break handling ([#4](https://github.com/brrian/pomello-service/issues/4)) ([dd715f4](https://github.com/brrian/pomello-service/commit/dd715f452879d78c2c1bc1560f5694eee4dbe666))

### 0.0.4 (2022-02-21)

### 0.0.3 (2022-02-21)

### 0.0.2 (2022-02-19)

### Features

- add pomodoro set setting ([#1](https://github.com/brrian/pomello-service/issues/1)) ([688d5bc](https://github.com/brrian/pomello-service/commit/688d5bc85b4b812c7a3df78a3773bb274db1056d))

### 0.0.1 (2022-02-19)

### Features

- initial commit ([7257cb1](https://github.com/brrian/pomello-service/commit/7257cb16bb35b0f13e3ac6946c3ff2abebd4be3d))
