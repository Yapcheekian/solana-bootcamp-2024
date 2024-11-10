```shell
# mint authority
solana-keygen grind --starts-with bos:1

# token mint
solana-keygen grind --starts-with mnt:2

spl-token create-token --program-id TokenzQdBNbLqP5VEhdkAS6EPFLC1PHnBqCXEpPxuEb --enable-metadata mnt5WKctAUHh7zr9URvoXrmMUKb6BAYZ6Lk4UHrW11D.json


# metadata
spl-token initialize-metadata mnt5WKctAUHh7zr9URvoXrmMUKb6BAYZ6Lk4UHrW11D 'Example' 'EMPL' 'image_url'


# mint token
spl-token create-account mnt5WKctAUHh7zr9URvoXrmMUKb6BAYZ6Lk4UHrW11D

spl-token mint mnt5WKctAUHh7zr9URvoXrmMUKb6BAYZ6Lk4UHrW11D 1000
```
