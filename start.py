# Copyright 2025 Super Curl Inc
# All rights reserved
# Version 1.0.0

import time
import sys

messages = [
	"this is super curls inc",
	"take your seat",
	"enjoy your meal",
	"have a nice day",
	"see you again",
	"goodbye",
	"we hope to see you again",
	"thank you for your support",
	"we will make stuff soon",
	"power to the people"
]

def animate_message(msg, delay=0.05):
	for char in msg:
		sys.stdout.write(char)
		sys.stdout.flush()
		time.sleep(delay)
	print()

print("\n==============================")
print("   Super Curl Inc Presents   ")
print("==============================\n")
for message in messages:
	animate_message(message)
	time.sleep(0.5)
print("\nCopyright 2025 Super Curl Inc")
print("All rights reserved")
print("Version 1.0.0")