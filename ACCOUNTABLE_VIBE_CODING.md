# Accountable Vibe Coding

> AI may help write the code, but humans must understand it, verify it,
> maintain it, and remain accountable for what it does.

Accountable Vibe Coding is the engineering standard of VN Technologies. It
allows people to use AI for speed, exploration, explanation, and implementation
without surrendering human judgment or responsibility.

## Core principles

1. **Human-understandable architecture** — A competent developer must be able
   to trace the system without depending on AI to decipher it.
2. **Every function is documented** — Each function explains its purpose,
   inputs, return value, important rules, side effects, and possible errors.
3. **No silent failures** — Empty catch blocks and ignored errors are prohibited.
4. **AI output is reviewed** — Generated code is checked for correctness,
   security, privacy, accessibility, performance, and operational fit.
5. **Business rules remain traceable** — Important behavior identifies its law,
   policy, ordinance, configuration, or agreed operational basis.
6. **Failure paths are tested** — Tests cover invalid data, permission failures,
   interruptions, duplicates, recovery, and other realistic negative paths.
7. **Security and privacy are built in** — Sensitive information is protected in
   screens, logs, integrations, storage, exports, backups, and support workflows.
8. **Maintainability is part of completion** — Another developer must be able to
   understand, troubleshoot, test, and safely modify the work.
9. **Humans retain control** — Consequential actions must remain explainable,
   reviewable, authorized, and reversible when the domain permits it.
10. **Technology must benefit people** — Speed matters only when the result is
    accurate, accessible, trustworthy, and useful to the community it serves.

## Function documentation standard

Every function must have a documentation block or concise explanatory comment.
For non-trivial functions, document:

- purpose;
- parameters and expected validation state;
- return value;
- business or legal rules;
- side effects;
- possible errors and how callers should handle them; and
- security or privacy considerations when relevant.

Comments explain **why** the code exists and what must remain true. They must not
merely translate syntax into English. Comments, tests, and documentation must be
updated whenever behavior changes.

## Error and diagnostic standard

Errors must be useful without exposing secrets or personal information.

User-facing failures should provide:

- a plain-language explanation;
- an actionable next step;
- a stable error code when the failure can recur; and
- a reference or correlation ID when support may need diagnostic details.

Technical diagnostics should include, when relevant:

- severity and stable error code;
- timestamp and component;
- operation being attempted;
- safe contextual identifiers;
- trace or correlation ID; and
- the original exception and stack trace in protected logs.

Validation errors, operational errors, security events, and audit events are
different records and must not be treated as interchangeable.

## Definition of done

A change is complete only when it is:

- understood by a human reviewer;
- documented at the code and workflow level;
- tested for successful and unsuccessful paths;
- observable through useful diagnostics;
- secure and appropriate for the information it handles;
- traceable to its requirements and business rules; and
- transferable to another developer.

## Pull-request checklist

- [ ] A human reviewer can explain the change and its consequences.
- [ ] Every new or changed function is documented.
- [ ] Errors are handled deliberately; there are no silent catches.
- [ ] Logs exclude passwords, tokens, confidential records, and unnecessary
      personal information.
- [ ] Business rules identify their source or configurable basis.
- [ ] Automated or documented tests cover success and realistic failure paths.
- [ ] Security, privacy, accessibility, and permission effects were reviewed.
- [ ] User, operator, troubleshooting, and developer documentation were updated.
- [ ] The change can be safely maintained without its original author.

## Responsibility model

AI can propose, generate, explain, compare, and review. People define the
purpose, provide context, decide boundaries, verify the result, and remain
answerable for the outcome.

VN Technologies uses AI to increase human capability—not to remove human
understanding, ownership, or accountability.
