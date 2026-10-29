# Reward claims rely on the delivery deadline, not on expiring

A delivery claims its History row (`webhook_logs`), the trigger's cooldown and its daily-cap count before scoring on Habitica, and gives back whatever didn't score. If Vercel stops the function partway through, nothing gives them back. The delivery then shows as rewarded, the trigger rests and the cap is used, although nothing scored, and a redelivery from GitHub is ignored as already rewarded.

We prevent that with time limits instead of claims that expire. Every Habitica request ends after 10 seconds, and each delivery has a 50-second deadline that ends retries, rate-limit waits and Habitica calls, so the claims are given back before `maxDuration` (60 seconds). Claims that expire would mean storing them as pending with a time, marking them rewarded after scoring, and letting a stale pending claim be taken again. That is a schema change to `webhook_logs` and the triggers that is hard to undo, and with the deadline in place only a hanging Postgres could still stop the function first.

## Consequences

- Production logs from 29 October 2026 showed 312 deliveries in 10 hours with no timeout, rate limit or failure, so this guards against a failure that hasn't been seen yet.
- If stuck claims ever do show up, for example from a database that stops answering, revisit this and make claims expire.
