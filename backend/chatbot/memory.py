from collections import defaultdict, deque

MEMORY = defaultdict(lambda: deque(maxlen=5))


def save_message(user_id, message, reply):
    MEMORY[user_id].append((message, reply))


def get_history(user_id):
    history = MEMORY[user_id]
    if not history:
        return ""
    # Join the last few messages to provide context
    return " ".join([f"User: {m} Bot: {r}" for m, r in history])
