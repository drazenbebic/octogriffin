# Octogriffin

Octogriffin turns what people do on GitHub into scored tasks on their Habitica character. GitHub tells it about activity through webhook deliveries; triggers decide what each one is worth.

## Language

### GitHub events

**Delivery**:
One notification GitHub sends about one event, identified by its delivery ID. The same Delivery can arrive more than once, when GitHub redelivers it or Octogriffin retries it, and is still rewarded only once.
_Avoid_: Webhook (for a single notification), request, hook

**Webhook dispatch**:
Handing a Delivery whose signature checked out to the one handler for its event.
_Avoid_: Routing, receiving

**Event name**:
The full name of a GitHub event, its type and action joined by a dot, e.g. `pull_request.closed`. Events without an action, like `push`, are just their type.
_Avoid_: Event type (GitHub's name for the part before the dot)

**Rewardable event**:
An event a Trigger can reward, like `push` or `issues.opened`.
_Avoid_: Universal event, supported event

**App event**:
An event about Octogriffin itself rather than someone's work: where it's installed, which repositories it may see, and GitHub Marketplace purchases. App events are never rewarded.
_Avoid_: Dedicated event, installation event (when Marketplace purchases are included)

### Rewards

**Trigger**:
A user's rule that scores one of their Habitica tasks when a Rewardable event happens in repositories they picked.

**Reward Policy**:
The rules that decide who gets rewarded for a Rewardable event, by which Triggers, and how often.
_Avoid_: Reward engine, scoring logic
