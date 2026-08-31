# AI Office 프로젝트 전체 기획서

## 1. 프로젝트 개요

### 프로젝트명

**AI Office**

가칭:

* AgentHQ
* CrewOS
* My AI Company
* CompanyOS

### 한 줄 소개

사용자가 CEO가 되어 여러 AI Agent를 직원처럼 운영하고, 업무를 배정하며, Agent들이 서로 협업·회의·검토하면서 실제 프로젝트를 수행하도록 만드는 가상 AI 회사 운영 플랫폼.

### 최종 목표

AI Office의 목표는 단순히 AI 캐릭터들이 사무실에서 움직이는 화면을 만드는 것이 아니다.

실제로 다음 요소들이 연결되어 동작하는 AI 회사 운영 시스템을 만드는 것이 목표다.

```text
Project
+
Conversation
+
Task
+
Agent
+
Meeting
+
Decision
+
Memory
+
Tool
+
Approval
+
Organization
+
History
```

핵심 개념:

> AI 캐릭터가 움직이는 사무실이 아니라, 실제로 업무가 흐르고 기억되는 AI 회사를 만든다.

---

# 2. 핵심 사용자 역할

사용자는 AI Office 안에서 회사의 **CEO** 역할을 한다.

CEO는 다음 작업을 수행한다.

```text
프로젝트 생성

AI 직원에게 업무 요청

진행 상황 확인

Agent 간 회의 확인

결과 검토

중요 작업 승인

과거 프로젝트 확인

이전 업무 재개
```

---

# 3. 전체 업무 흐름

기본적인 Agent Workflow는 다음과 같다.

```text
CEO

↓

PM Agent

↓

요구사항 분석

↓

Task 분해

↓

Agent에게 업무 할당

↓

Agent 작업

↓

Agent 간 협업

↓

필요 시 회의

↓

QA 검증

↓

CEO Approval

↓

DONE
```

모든 과정은 Pixel Office에서 실시간으로 표현된다.

---

# 4. 개발 전략

프로젝트는 처음부터 모든 기능을 구현하지 않는다.

전체 개발을 두 단계로 나눈다.

## V1

```text
MVP
```

AI Office의 핵심 구조를 완성한다.

목표:

> 여러 AI Agent가 역할을 나눠 업무를 수행하고, 회의를 진행하고, 결과를 검증하고, 이전 작업까지 다시 이어갈 수 있는 AI Office MVP.

---

## V2

```text
Real AI Company
```

V1에서 만든 Agent 구조를 실제 외부 시스템과 연결한다.

목표:

> AI 직원들이 GitHub, Terminal, File System, MCP 등의 Tool을 사용하여 실제 프로젝트를 직접 수행하게 한다.

---

# 5. 전체 로드맵

```text
V0
Office Prototype

↓

V1
AI Office MVP

↓

V2
Real AI Company

↓

Future
Advanced Autonomous Company
```

---

# 6. V0 — Office Prototype

V0에서는 AI 기능 없이 Office UI와 Agent 상태 시스템을 먼저 검증한다.

초기 Agent:

```text
PM
Developer
QA
```

초기 상태:

```text
IDLE
WORKING
MEETING
```

예:

```text
IDLE
→ 책상

WORKING
→ 컴퓨터

MEETING
→ 회의실
```

임의 Event를 발생시켜 캐릭터가 올바르게 반응하는지 확인한다.

---

# 7. V1 — MVP

V1은 프로젝트의 첫 번째 실제 완성 버전이다.

V1에서는 다음 요소가 실제로 연결되어야 한다.

```text
Conversation

Project

Task

Agent

Meeting

Decision

QA

Approval

Memory

History

Resume
```

---

# 8. V1 Agent 구성

MVP에서는 Agent를 너무 많이 만들지 않는다.

초기 구성:

```text
PM Agent

Research Agent

Developer Agent

QA Agent
```

---

# 9. PM Agent

역할:

```text
사용자 요구사항 분석

프로젝트 계획

Task 분해

Task 생성

담당 Agent 선정

Task Dependency 생성

Agent 진행 상황 확인

회의 필요 여부 판단

회의 생성 및 진행

최종 결과 정리
```

PM Agent는 AI Office에서 전체 업무 흐름을 관리하는 핵심 Agent다.

---

# 10. Research Agent

역할:

```text
기술 조사

정보 조사

프로젝트 배경 조사

필요한 Context 제공

기술 비교

의사결정 자료 제공
```

V1에서는 Web Tool 없이 LLM 기반 조사 결과를 제공하는 수준으로 제한할 수 있다.

---

# 11. Developer Agent

역할:

```text
기술 설계

구현 방법 제안

코드 작성

코드 수정

문제 해결

회의 참여

QA 수정 요청 대응
```

V1에서는 실제 Repository 수정까지는 하지 않아도 된다.

코드나 구현 결과를 생성하는 것까지만 지원한다.

---

# 12. QA Agent

역할:

```text
요구사항 검증

Developer 결과 검토

오류 탐지

누락 기능 탐지

수정 요청

최종 PASS / FAIL 결정
```

예:

```text
Developer
↓
Result

↓

QA

↓

PASS
또는
REVIEW_FAILED
```

---

# 13. Agent 상태 시스템

V1 Agent 상태:

```text
IDLE

PLANNING

WORKING

MEETING

REVIEWING

WAITING

WAITING_APPROVAL

PAUSED

ERROR

DONE
```

---

# 14. Agent 상태와 Office UI

상태는 실제 Agent Runtime과 연결된다.

```text
IDLE
→ 자신의 책상

PLANNING
→ 화이트보드

WORKING
→ 컴퓨터 작업

MEETING
→ 회의실 이동

REVIEWING
→ 문서 또는 다른 직원 자리

WAITING
→ 대기

WAITING_APPROVAL
→ CEO Office

PAUSED
→ 중단 상태

ERROR
→ 느낌표

DONE
→ 자리 복귀
```

Pixel Office는 Agent Runtime을 시각화하는 UI다.

가짜 애니메이션을 보여주는 구조로 만들지 않는다.

---

# 15. Pixel Office

메인 UI는 가상의 회사 사무실 형태로 구성한다.

예:

```text
┌──────────────── AI OFFICE ────────────────┐
│                                           │
│ CEO OFFICE                                │
│    👑                                      │
│                                           │
│            PM AREA                        │
│              🧑‍💼                          │
│           Planning...                     │
│                                           │
│ DEVELOPMENT AREA                          │
│       👨‍💻                                 │
│      Coding...                            │
│                                           │
│             MEETING ROOM                  │
│                                           │
│          🧑‍💼 👨‍💻 🧪                       │
│            Meeting...                     │
│                                           │
│ QA AREA                                   │
│   🧪                                      │
│ Testing...                                │
│                                           │
└───────────────────────────────────────────┘
```

---

# 16. V1 Task System

AI Office의 모든 실제 업무는 Task 기반으로 관리한다.

Task 예:

```text
TASK-001

Title:
Authentication 구조 설계

Assignee:
Developer Agent

Status:
IN_PROGRESS

Depends On:
TASK-000
```

Task 상태:

```text
BACKLOG

TODO

IN_PROGRESS

REVIEW

DONE

FAILED

PAUSED
```

---

# 17. Task Dependency

Task 간 의존성을 지원한다.

예:

```text
Research

↓

Architecture

↓

Development

↓

QA

↓

CEO Approval
```

Research가 끝나지 않았다면 Developer가 관련 Task를 실행하지 않는다.

---

# 18. Agent Run

Agent가 Task를 실행할 때마다 Agent Run을 생성한다.

```text
Task

↓

Agent Run

↓

Result
```

Agent Run에는 다음을 기록한다.

```text
agent

task

status

started_at

finished_at

result

token_usage

error
```

---

# 19. 회의실 시스템

회의실은 AI Office의 핵심 기능 중 하나다.

회의 발생 조건:

```text
기술적 의사결정 필요

Agent 의견 충돌

QA 문제 발견

요구사항 불명확

여러 Agent 의견 필요
```

---

# 20. 회의 시작

예:

```text
Authentication Architecture 결정 필요
```

PM Agent가 회의를 요청한다.

참석자:

```text
PM

Developer

QA
```

Office UI에서는 참석 Agent들이 회의실로 이동한다.

---

# 21. 회의 진행

예:

```text
PM:

로그인 인증 구조를 결정해야 합니다.


Developer:

JWT + Refresh Token 방식을 추천합니다.


QA:

Refresh Token 저장 방식도 검증해야 합니다.


Developer:

httpOnly Cookie에 저장하겠습니다.


QA:

그 구조라면 보안 검증이 가능합니다.


PM:

해당 구조로 결정합니다.
```

---

# 22. 회의 결과

회의 종료 후 구조화된 결과를 생성한다.

```text
Meeting

Topic

Participants

Messages

Decision

Action Items
```

예:

```text
Decision #14

Topic:
Authentication Architecture

Decision:

JWT
+
Refresh Token
+
httpOnly Cookie
```

---

# 23. 회의 Action Item

회의 결과 새로운 업무가 필요한 경우 Task를 생성한다.

```text
TASK-21

Refresh Token API 구현
```

```text
TASK-22

Authentication QA Test 작성
```

---

# 24. Decision System

중요한 기술적 의사결정을 별도로 저장한다.

예:

```text
Decision

Title:
Authentication Strategy

Decision:
JWT + Refresh Token

Reason:
Client와 API 서버 분리 구조이며
Session보다 확장성이 적절함.

Created By:
Meeting #14
```

이 정보는 이후 Agent Memory에도 포함된다.

---

# 25. Event System

Agent Runtime과 Office UI 사이의 핵심 통신은 Event 기반으로 구성한다.

주요 Event:

```text
PROJECT_CREATED

TASK_CREATED

TASK_ASSIGNED

TASK_STARTED

TASK_COMPLETED

TASK_FAILED

AGENT_STATUS_CHANGED

MEETING_STARTED

AGENT_SPEAKING

MEETING_FINISHED

DECISION_CREATED

REVIEW_REQUESTED

REVIEW_FAILED

REVIEW_PASSED

APPROVAL_REQUIRED

APPROVED

REJECTED

WORK_PAUSED

WORK_RESUMED
```

---

# 26. Event 예시

```json
{
  "type": "AGENT_STATUS_CHANGED",
  "agentId": "developer-01",
  "status": "WORKING"
}
```

Office UI:

```text
Developer Agent

책상으로 이동

↓

Typing Animation
```

---

# 27. 실시간 통신

Backend와 Office UI는 WebSocket을 사용한다.

```text
Agent Runtime

↓

Event

↓

WebSocket

↓

Frontend

↓

Pixel Office
```

---

# 28. CEO Approval

중요한 결과는 사용자가 CEO 역할로 승인한다.

예:

```text
Authentication 구현 완료


[Approve]

[Reject]
```

Approve:

```text
APPROVED

↓

DONE
```

Reject:

```text
REJECTED

↓

PM

↓

수정 Task 생성
```

---

# 29. V1 Conversation System

사용자는 AI Office에서 Agent와 대화할 수 있다.

대화는 단순 ChatGPT 형식이 아니라 실제 프로젝트 업무와 연결된다.

```text
Conversation

↓

Project

↓

Tasks

↓

Meetings

↓

Decisions
```

---

# 30. Conversation 구조

하나의 Project는 여러 Conversation을 가질 수 있다.

```text
Project

├ Conversation 1
│  └ 요구사항 논의
│
├ Conversation 2
│  └ 개발 작업
│
├ Conversation 3
│  └ QA 수정
│
├ Meeting 1
│
└ Tasks
```

---

# 31. Conversation History

사용자가 이전 대화를 다시 볼 수 있도록 한다.

사이드바 예:

```text
+ New Project


Office

Projects


History

Today

- 로그인 기능 개발
- PostgreSQL 설계


Yesterday

- Landing Page 개발


Previous

- AI Office 기획
```

---

# 32. Conversation 정보

각 Conversation에는 다음 정보를 저장한다.

```text
Title

Project

Participants

Status

Last Message

Last Activity

Summary
```

예:

```text
로그인 기능 개발

Project:
Web Platform

Agents:
PM / Developer / QA

Status:
PAUSED

Last Activity:
15:32
```

---

# 33. 이전 Conversation 열기

History에서 Conversation을 선택하면 과거 메시지를 불러온다.

```text
Conversation 선택

↓

Message 불러오기

↓

Project 로딩

↓

Task 로딩

↓

Meeting 로딩

↓

Decision 로딩
```

---

# 34. Resume Work

이 기능은 단순 Chat History보다 중요하다.

사용자는 이전 Conversation에서 업무를 다시 이어갈 수 있다.

```text
Previous Work

↓

Resume Work

↓

Context 복원

↓

중단 Task 확인

↓

Agent 활성화

↓

작업 재개
```

---

# 35. PAUSED 상태

이전 세션이 종료되었을 때 Runtime Agent가 계속 WORKING 상태로 남아 있으면 안 된다.

예:

저장된 상태:

```text
Developer

WORKING
```

다시 접속했을 때:

```text
Developer

PAUSED
```

사용자가 Resume을 누르면:

```text
PAUSED

↓

WORKING
```

---

# 36. Resume 예시

이전 상태:

```text
Project:
Authentication System

TASK-12:
Developer
PAUSED

TASK-13:
QA
WAITING
```

Resume:

```text
PM:

이전 작업을 확인했습니다.

TASK-12가 중단되어 있습니다.

해당 작업부터 다시 진행합니다.
```

---

# 37. Conversation Context 복원

이전 채팅 전체를 매번 AI에게 전달하면 안 된다.

문제가 생긴다.

```text
Token 증가

Cost 증가

응답 속도 저하

Context Limit
```

따라서 다음 구조를 사용한다.

```text
Project Memory

+

Conversation Summary

+

Important Decisions

+

Related Tasks

+

Recent Messages
```

---

# 38. Conversation Summary

긴 대화는 자동 요약한다.

예:

```text
Conversation Summary

사용자는 로그인 기능 구현을 요청했다.

결정:

JWT 사용

Refresh Token 사용

httpOnly Cookie 사용

Developer가 기본 인증 구조 설계를 완료했다.

남은 업무:

Refresh Token Rotation

QA Test
```

---

# 39. Recent Message Window

최근 메시지는 원문 그대로 유지한다.

예:

```text
최근 20~50개 메시지
```

그 이전 내용은 Summary로 변환한다.

Agent Context:

```text
Project Memory

↓

Conversation Summary

↓

Recent Messages

↓

Current Task
```

---

# 40. V1 Memory System

V1에서는 Memory를 단순하게 유지한다.

## Task Memory

```text
현재 Task

관련 요구사항

이전 Agent 결과

관련 회의
```

## Project Memory

```text
기술 스택

프로젝트 요구사항

Architecture Decision

중요한 회의 결과
```

---

# 41. Conversation과 Task 연결

Conversation에서 생성된 Task를 연결한다.

예:

```text
Conversation

"로그인 기능 구현"

↓

TASK-12

Authentication API


TASK-13

Refresh Token


TASK-14

QA Test
```

---

# 42. Conversation과 Meeting 연결

Conversation 중 발생한 회의도 연결한다.

```text
Conversation

↓

Meeting #14

Authentication Architecture
```

사용자는 과거 Conversation에서 회의 기록도 다시 확인할 수 있다.

---

# 43. Conversation과 Decision 연결

회의에서 나온 Decision도 History에서 확인할 수 있다.

```text
Conversation

↓

Meeting

↓

Decision
```

---

# 44. V1 데이터베이스 구조

MVP 주요 테이블:

```text
projects

conversations

messages

conversation_agents

agents

tasks

task_dependencies

agent_runs

agent_messages

meetings

meeting_messages

decisions

project_memories

approvals
```

---

# 45. conversations

예상 필드:

```text
id

project_id

title

status

summary

created_at

updated_at

last_message_at
```

status:

```text
ACTIVE

PAUSED

ARCHIVED
```

---

# 46. messages

예상 필드:

```text
id

conversation_id

sender_type

sender_id

message_type

content

created_at
```

sender_type:

```text
USER

AGENT

SYSTEM
```

message_type:

```text
TEXT

TASK

MEETING

DECISION

SYSTEM

TOOL_RESULT
```

---

# 47. V1 AI Runtime

프로젝트 개발에는 Codex를 사용한다.

```text
Codex

=

AI Office 프로젝트를 개발하는 개발 도구
```

서비스 내부 Agent에는:

```text
OpenAI API

또는

OpenAI Agents SDK
```

를 사용한다.

```text
OpenAI Agent Runtime

=

AI Office 안에서 근무하는 AI 직원
```

---

# 48. Agent 기본 구조

예:

```ts
interface Agent {
  id: string;
  name: string;
  role: string;
  status: AgentStatus;

  execute(task: Task): Promise<AgentResult>;
}
```

Agent 정보:

```text
id

name

role

instructions

model

status

memory
```

---

# 49. V1 기술 스택

## Frontend

```text
Next.js

TypeScript

Tailwind CSS

PixiJS

Zustand
```

PixiJS:

```text
Pixel Office

Agent Character

Movement

Animation
```

---

## Backend

```text
NestJS

PostgreSQL

Redis

BullMQ

WebSocket
```

---

## AI

```text
OpenAI API

또는

OpenAI Agents SDK
```

---

## Development

```text
Codex

Git

Docker
```

---

# 50. V1 MVP 완료 조건

다음 Scenario가 처음부터 끝까지 동작하면 V1을 완료한 것으로 본다.

```text
CEO

"로그인 기능을 만들어줘."

↓

Conversation 생성

↓

PM Agent

요구사항 분석

↓

Task 생성

↓

Developer Agent

업무 수행

↓

PM

기술 결정 필요 판단

↓

Meeting 생성

↓

PM + Developer + QA

회의실 이동

↓

Authentication 구조 토론

↓

Decision 생성

↓

Developer

작업 완료

↓

QA

검증

↓

CEO

Approve

↓

DONE
```

그리고 브라우저를 닫는다.

다시 접속:

```text
History

↓

로그인 기능 개발

↓

Conversation Open

↓

기존 대화 확인

↓

Resume Work

↓

중단된 Task 복원

↓

Agent 상태 복원

↓

업무 계속 진행
```

여기까지 동작해야 V1 MVP가 완성된 것이다.

---

# 51. V1에서 하지 않는 것

다음 기능은 V2로 미룬다.

```text
실제 GitHub 코드 수정

Branch 생성

Commit

PR

PR Merge

Terminal

File System

MCP

Agent 직접 고용

조직도

고급 Permission

비용 관리

Agent 성과 평가

여러 Project 동시 실행

Conversation Fork

Semantic Search

Company Memory
```

---

# 52. V2 — Real AI Company

V2는 V1에서 만든 AI Office를 실제 업무 수행 플랫폼으로 확장한다.

V1:

```text
AI Agent가 업무를 수행하고
그 결과를 AI Office에서 관리
```

V2:

```text
AI Agent가 실제 외부 Tool을 사용하여
현실의 결과를 만들어냄
```

---

# 53. V2 핵심 기능

```text
GitHub Integration

Tool System

MCP

Agent Hiring

Organization

Company Memory

Advanced Meeting

Approval Center

Agent Performance

Cost Management

Multiple Projects

Advanced Conversation History
```

---

# 54. V2 GitHub Integration

가장 우선순위가 높은 V2 기능이다.

AI Office 프로젝트와 GitHub Repository를 연결한다.

지원 작업:

```text
Repository 조회

Issue 생성

Branch 생성

파일 수정

Commit

PR 생성

PR Review

Merge
```

---

# 55. GitHub 작업 흐름

```text
CEO

"로그인 기능 구현해."

↓

PM

Task 생성

↓

Developer

Repository 분석

↓

Branch 생성

↓

코드 수정

↓

Test

↓

QA

검토

↓

Developer

PR 생성

↓

CEO Approval

↓

Merge
```

---

# 56. V2 Tool System

Agent마다 사용할 수 있는 Tool을 다르게 한다.

Developer:

```text
GitHub

Terminal

File System

Test Runner
```

Research:

```text
Web Search

Browser

Document Reader
```

QA:

```text
GitHub

Browser

Test Runner

Code Review
```

---

# 57. Tool Permission

Agent에게 모든 권한을 주지 않는다.

```text
READ_FILE

→ 자동


SEARCH_WEB

→ 자동


RUN_TEST

→ 자동


WRITE_FILE

→ 제한


GIT_COMMIT

→ 제한


GIT_PUSH

→ 승인


PR_MERGE

→ 승인


DEPLOY

→ 승인


DATABASE_MIGRATION

→ 승인


DELETE

→ 승인
```

---

# 58. Approval Center

V2에서는 모든 중요한 승인 요청을 한 화면에서 관리한다.

예:

```text
Approval Center


PR #42 Merge

Developer Agent

[Approve]

[Reject]


Production Deployment

DevOps Agent

[Approve]

[Reject]
```

---

# 59. Agent Hiring

사용자가 직접 새로운 AI 직원을 생성한다.

예:

```text
Create Agent


Name:

Alex


Role:

Backend Engineer


Model:

GPT


Tools:

GitHub

Terminal

Database


Reports To:

CTO
```

생성된 Agent는 Pixel Office에도 나타난다.

---

# 60. Organization System

회사를 실제 조직 형태로 관리한다.

```text
CEO
│
├ CTO
│ ├ Backend Agent
│ ├ Frontend Agent
│ └ DevOps Agent
│
├ CPO
│ ├ PM Agent
│ └ Designer Agent
│
└ QA Lead
  └ QA Agent
```

---

# 61. Advanced Meeting

V2에서는 회의를 더 체계적으로 만든다.

```text
Meeting Request

↓

Participants Selection

↓

Agenda

↓

Discussion

↓

Conflict Resolution

↓

Decision

↓

Action Items

↓

Tasks
```

---

# 62. Meeting Agenda

예:

```text
Meeting #32

Topic:

Database Selection


Agenda:

1. PostgreSQL vs MongoDB

2. 데이터 구조

3. 확장성

4. 운영 비용
```

---

# 63. Company Memory

V2에서는 Project Memory를 회사 전체 Memory로 확장한다.

## Short-term Memory

```text
현재 Task

현재 Meeting

최근 Conversation
```

## Project Memory

```text
Architecture

Requirement

Coding Convention

Decision
```

## Company Memory

```text
회사 규칙

보안 정책

기술 정책

Agent 역할

과거 프로젝트 결정
```

예:

```text
Backend 기본 Stack은 NestJS를 사용한다.

Production Migration은 CEO 승인이 필요하다.

Frontend 상태 관리는 Zustand를 사용한다.
```

---

# 64. Agent Performance

Agent별 업무 성과를 분석한다.

예:

```text
Developer Agent

Tasks:
42

Success:
38

Failed:
4

Success Rate:
90.4%

Average Cost:
$0.18

Average Duration:
2m 14s
```

---

# 65. Agent Performance Dashboard

```text
Agent         Tasks   Success   Cost

PM             21       95%     $0.81

Developer      15       80%     $4.21

Research       32       96%     $1.71

QA             19       89%     $0.93
```

---

# 66. Cost Management

AI 직원의 API 사용 비용을 추적한다.

```text
Monthly Budget

$50


Used

$18.42


Remaining

$31.58
```

분석 단위:

```text
Agent

Project

Task

Model
```

---

# 67. Budget Policy

Agent가 프로젝트 Budget을 넘기려고 하면 CEO 승인을 요구한다.

```text
Estimated Cost

$2.42


Remaining Budget

$1.84


Approval Required
```

---

# 68. Multiple Projects

하나의 AI 회사에서 여러 프로젝트를 동시에 운영한다.

```text
Project A

Landing Page

Progress 82%


Project B

Discord Bot

Progress 47%


Project C

Portfolio

Progress 15%
```

---

# 69. V2 Conversation Search

Conversation이 많아지면 검색 기능을 제공한다.

검색 대상:

```text
Conversation

Message

Task

Meeting

Decision

Project
```

예:

```text
Search:

JWT
```

결과:

```text
로그인 기능 개발

Authentication Meeting

Backend Architecture
```

---

# 70. Conversation Pin

중요한 Conversation을 고정한다.

```text
Pinned

★ AI Office 개발

★ Authentication
```

---

# 71. Conversation Archive

종료된 대화는 삭제보다 Archive 처리한다.

```text
ACTIVE

PAUSED

ARCHIVED
```

---

# 72. Conversation Fork

특정 시점에서 새로운 방향으로 Conversation을 분기할 수 있다.

예:

```text
Authentication Discussion

├ JWT 방식

└ Session 방식
```

특정 메시지에서:

```text
[Fork Conversation]
```

을 선택한다.

---

# 73. Conversation Branch

새 Conversation은 원본 대화의 특정 시점까지 Context를 공유한다.

```text
Original Conversation

↓

Message #32

↓

Fork

↓

New Conversation
```

이를 통해 같은 문제를 여러 방식으로 실험할 수 있다.

---

# 74. Semantic History

V2에서는 단순 텍스트 검색뿐 아니라 의미 기반 History 검색도 지원할 수 있다.

예:

```text
"우리가 인증 보안 관련해서 결정했던 거 찾아줘."
```

결과:

```text
Meeting #14

Authentication Architecture

Decision #8

Refresh Token Storage
```

---

# 75. GitHub와 Conversation 연결

V2에서는 개발 작업 기록을 Conversation과 연결한다.

예:

```text
Conversation

로그인 기능 개발

↓

TASK-42

↓

Branch

feature/auth

↓

Commit

c14f82a

↓

PR

#31
```

---

# 76. Work Session History

최종적으로 History는 단순 Chat History가 아니다.

복원 대상:

```text
Conversation

Project

Tasks

Meetings

Decisions

Agent State

Memory

Tool Calls

Commits

Pull Requests
```

따라서 이 시스템은:

> Conversation History

보다는:

> **Work Session History & Resume System**

으로 설계한다.

---

# 77. V2 데이터베이스 확장

추가 테이블:

```text
companies

departments

agent_tools

tool_calls

tool_permissions

agent_memories

company_memories

agent_performance

budgets

cost_records

integrations

conversation_branches

conversation_embeddings
```

---

# 78. V2 완료 Scenario

V2 대표 Scenario:

```text
CEO

"우리 프로젝트 로그인 기능 구현해줘."

↓

기존 Project Conversation 열기

↓

Resume

↓

PM

기존 Context 확인

↓

Task 생성

↓

Developer

GitHub Repository 분석

↓

Meeting 필요

↓

PM + Developer + QA

회의실 이동

↓

Architecture Decision

↓

Developer

Branch 생성

↓

코드 수정

↓

Test

↓

QA

Review

↓

Developer

PR 생성

↓

Approval Center

↓

CEO

Approve

↓

PR Merge

↓

Conversation History 저장

↓

DONE
```

---

# 79. V1 / V2 비교

| 기능                   | V1 MVP | V2  |
| -------------------- | ------ | --- |
| Pixel Office         | O      | O   |
| Agent State          | O      | O   |
| Task System          | O      | O   |
| Task Dependency      | O      | O   |
| Multi-Agent Workflow | O      | O   |
| Meeting              | O      | 고도화 |
| Decision             | O      | O   |
| QA                   | O      | O   |
| CEO Approval         | 기본     | 고급  |
| Project Memory       | O      | O   |
| Conversation         | O      | O   |
| Conversation History | O      | O   |
| Resume Work          | O      | O   |
| PAUSED 상태            | O      | O   |
| Conversation Summary | O      | O   |
| Search               | X      | O   |
| Pin / Archive        | X      | O   |
| Fork / Branch        | X      | O   |
| Semantic History     | X      | O   |
| 실제 GitHub 작업         | X      | O   |
| Terminal             | X      | O   |
| File System          | X      | O   |
| MCP                  | X      | O   |
| Agent Hiring         | X      | O   |
| Organization         | X      | O   |
| Company Memory       | X      | O   |
| Agent Performance    | X      | O   |
| Cost Management      | X      | O   |
| Multiple Projects    | X      | O   |

---

# 80. 실제 개발 순서

## Phase 0

```text
Next.js Project Setup

Pixel Office

Agent Character

Movement

Basic State
```

---

## Phase 1

```text
Backend Setup

Database

Agent Model

Task Model

Agent State

Event System

WebSocket
```

---

## Phase 2

```text
Project

Conversation

Messages

History Sidebar

Conversation Restore
```

---

## Phase 3

```text
PM Agent

Developer Agent

Research Agent

QA Agent

OpenAI 연결
```

---

## Phase 4

```text
Task Assignment

Task Dependency

Agent Run

Agent Result
```

---

## Phase 5

```text
Meeting System

Meeting UI

Agent Speaking

Decision

Action Items
```

---

## Phase 6

```text
QA

Review Flow

CEO Approval
```

---

## Phase 7

```text
Conversation Summary

Project Memory

PAUSED

Resume Work
```

---

## Phase 8

```text
V1 Testing

Bug Fix

Deployment
```

```text
V1 MVP COMPLETE
```

반드시 이 시점에 실제 배포한다.

---

# 81. V2 개발 순서

V1이 완성된 뒤 진행한다.

## Phase 9

```text
GitHub Integration
```

---

## Phase 10

```text
Tool Runtime

File

Terminal

Test Runner
```

---

## Phase 11

```text
Tool Permission

Approval Center
```

---

## Phase 12

```text
Agent Hiring

Departments

Organization
```

---

## Phase 13

```text
Company Memory

Advanced Meeting
```

---

## Phase 14

```text
Agent Performance

Cost Management
```

---

## Phase 15

```text
Multiple Projects

MCP
```

---

## Phase 16

```text
Search

Semantic History

Conversation Fork

Conversation Branch
```

```text
V2 COMPLETE
```

---

# 82. 핵심 개발 원칙

## 원칙 1

V1을 완성하기 전 V2를 만들지 않는다.

특히:

```text
GitHub

MCP

Agent Hiring

Organization

Cost Management
```

은 매우 쉽게 프로젝트 범위를 터뜨린다.

---

## 원칙 2

Pixel Office는 Runtime의 시각화 계층이다.

```text
Agent Runtime

↓

Event System

↓

Office UI
```

Runtime과 관계없는 가짜 캐릭터 행동을 핵심 기능으로 만들지 않는다.

---

## 원칙 3

모든 업무는 Task로 추적한다.

```text
Project

↓

Task

↓

Agent Run

↓

Result
```

---

## 원칙 4

모든 중요한 의사결정은 기록한다.

```text
Meeting

↓

Decision

↓

Memory
```

---

## 원칙 5

모든 업무 기록은 다시 복원 가능해야 한다.

```text
Conversation

↓

Project

↓

Task

↓

Agent State

↓

Resume
```

---

## 원칙 6

중요한 Agent 행동은 사람이 통제한다.

```text
Agent

↓

Action Request

↓

CEO Approval

↓

Execution
```

---

## 원칙 7

전체 대화 내용을 무식하게 Context에 넣지 않는다.

```text
Summary

+

Recent Messages

+

Memory

+

Current Task
```

구조를 사용한다.

---

# 83. 최종 제품 방향

V1의 제품 정의:

> 여러 AI 직원이 프로젝트의 업무를 나누어 수행하고, 필요하면 회의하며, QA와 CEO 승인을 거쳐 결과를 만들고, 사용자가 나중에 다시 접속해 이전 업무를 이어서 수행할 수 있는 AI Office MVP.

V2의 제품 정의:

> AI 직원들이 GitHub, Terminal, File System, MCP 등의 실제 Tool을 사용하고, 조직·권한·비용·성과·장기 기억을 가지고 현실의 프로젝트를 수행하는 AI Company Operating System.

최종적으로 AI Office가 목표하는 형태는 다음과 같다.

```text
AI Office

=

Virtual Office UI

+

Multi-Agent Runtime

+

Task Management

+

Meetings

+

Conversation

+

Work History

+

Memory

+

Human Approval

+

Real Tools
```

즉,

> **AI 직원들을 고용하고, 업무를 맡기고, 회의시키고, 결과를 검토하고, 어제 하던 업무를 오늘 다시 이어서 수행할 수 있는 나만의 AI 회사.**
