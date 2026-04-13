# CISSP #28: Cryptography Is Not Magic — Understanding the Primitives That Secure Everything

## 1. Positioning summary

- **Audience:** Software engineers who have used TLS, hashed passwords, and signed JWTs without thinking too hard about the primitives underneath — and CISSP candidates who need to reason about cryptographic choices, not just name algorithms.
- **Core argument:** Cryptography is not a single thing. It is a set of distinct primitives, each solving a specific problem. Confidentiality, integrity, and authenticity are separate concerns served by separate tools. The practical skill is knowing which primitive solves which problem — and why combining them matters.
- **Brand fit:** Applied security thinking for engineers. Bridges the implementation vocabulary (AES, RSA, SHA-256, HMAC) to the security architecture reasoning that CISSP demands.
- **Distinctive angle:** Frames cryptographic choices as engineering tradeoffs, not memorization targets. The hybrid encryption model (TLS's underlying design) becomes the payoff example that ties everything together.
- **Reader takeaway:** You do not need to implement cryptographic algorithms. You do need to understand what each primitive provides, what it does not provide, and how they combine in real protocols.

---

## 2. Research summary

### Established principles

- Symmetric encryption (AES, ChaCha20) uses the same key for encryption and decryption. It is fast and appropriate for bulk data encryption. The key distribution problem — how both parties securely get the same key — is its fundamental limitation.
- Asymmetric encryption (RSA, elliptic curve variants) uses a key pair: public for encryption or signature verification, private for decryption or signing. It solves the key distribution problem but is computationally expensive and not suited for bulk encryption.
- The hybrid model solves both: asymmetric cryptography is used to exchange a symmetric session key, then symmetric encryption handles the actual data. TLS is the canonical example.
- Hashing (SHA-256, SHA-3) produces a fixed-length digest from arbitrary input. It is one-directional: you cannot recover the input from the hash. Hashing alone provides integrity but not authenticity — anyone can compute a hash.
- Message Authentication Codes (HMAC) combine a hash function with a shared secret key. The MAC proves that the message was created by someone who holds the key, providing both integrity and authenticity (but not non-repudiation).
- Digital signatures use asymmetric cryptography: the sender signs with their private key, and any party with the public key can verify. Digital signatures provide integrity, authenticity, and non-repudiation.
- Non-repudiation is the property that the sender cannot later deny having signed a message. HMACs do not provide non-repudiation (both parties hold the same key). Digital signatures do.
- Key management is widely recognized as the hardest part of practical cryptography — generating, storing, rotating, and revoking keys securely is where most real-world failures occur, not in the algorithms themselves.

### CISSP exam considerations

- Domain 3 (Security Architecture and Engineering): cryptographic concepts, algorithms, key management, PKI.
- Domain 4 (Communication and Network Security): TLS, VPNs, email security (S/MIME, PGP), protocol-level cryptography.
- CISSP tests use-case reasoning: given a scenario, which cryptographic concept applies? What does the control provide and what does it not provide?
- Common exam framing: "Which provides non-repudiation?" / "A message is encrypted with the recipient's public key — what does this ensure?" / "What is the primary limitation of symmetric encryption?"
- Know the difference between: encryption vs hashing, symmetric vs asymmetric, MAC vs digital signature, confidentiality vs integrity vs authenticity vs non-repudiation.

### Practical engineering connections

- Password storage: hashing (bcrypt, Argon2) with salt — hashing is one-directional, not encryption. Encrypting passwords instead of hashing them is a design error.
- TLS handshake: asymmetric key exchange → symmetric session encryption. Both primitives used for what they do well.
- JWT signing: HMAC-SHA256 (symmetric, shared secret) or RS256 (asymmetric, private key signs, public key verifies). The choice affects whether non-repudiation is possible.
- Data at rest: AES-256 symmetric encryption. Key management (where the key lives and who can access it) is the real security question.
- Code signing / software supply chain: asymmetric digital signatures verify that a build artifact was produced by the expected party.

### Source anchors

- NIST SP 800-175B Rev. 1: Guideline for Using Cryptographic Standards in the Federal Government
- NIST SP 800-57 Part 1 Rev. 5: Recommendation for Key Management

---

## 3. Detailed blog post

### CISSP #28: Cryptography Is Not Magic — Understanding the Primitives That Secure Everything

Developers use cryptographic tools constantly without thinking about them.

You hash passwords before storing them. Your API calls go over TLS. You sign tokens, verify certificates, and read documentation that mentions AES-256 or SHA-256 without stopping to reason about what those choices actually provide.

That works very well — until you need to make a cryptographic decision yourself, evaluate whether a system's design is sound, or explain to a CISSP examiner which control provides non-repudiation and why.

Cryptography is not a single thing. It is a collection of distinct primitives, each solving a specific problem. The practical skill — for engineers and for CISSP — is knowing which primitive addresses which problem, what it does not address, and how the primitives combine into the protocols you already use.

<figure>
  <img src="{{ site.baseurl }}/assets/generated/2026/04/cissp-cryptography-primitives-not-magic/hero.svg" alt="Diagram mapping four cryptographic goals — confidentiality, integrity, authenticity, and non-repudiation — to the primitives that address each one: symmetric encryption, hashing, HMAC, and digital signatures.">
  <figcaption>Cryptography is a set of tools. Each primitive solves a specific problem. Knowing which is which is more useful than memorizing algorithm names.</figcaption>
</figure>

---

## Start with the goals, not the algorithms

The right entry point is not AES or RSA. It is the security properties you are trying to achieve.

**Confidentiality:** Only the intended recipient can read the data.

**Integrity:** The data has not been altered in transit or at rest.

**Authenticity:** The data came from the expected sender.

**Non-repudiation:** The sender cannot later deny having sent the data.

These are distinct properties. No single cryptographic primitive provides all of them. A system that needs all four requires a combination of tools.

This framing is exactly what CISSP tests: given a scenario, which property applies, and which primitive delivers it?

---

## Encryption addresses confidentiality — nothing else by default

Encryption transforms plaintext into ciphertext that can only be reversed with the correct key. Its purpose is confidentiality: preventing unauthorized parties from reading the data.

Encryption alone does not verify that the ciphertext was unmodified. It does not prove who sent it. It does not prevent the sender from denying they sent it.

Two families of encryption matter for CISSP:

### Symmetric encryption

One key is used for both encryption and decryption. AES (Advanced Encryption Standard) is the dominant example.

Symmetric encryption is fast and efficient — appropriate for encrypting bulk data. But it requires that both parties already have the same key. Getting that key to the other party securely is the key distribution problem, and it is the fundamental limitation of symmetric encryption.

If you and I want to communicate securely using symmetric encryption, we need a secure channel to share the key in the first place. That circular dependency is what asymmetric cryptography exists to break.

### Asymmetric encryption

Two mathematically linked keys: a public key and a private key. Data encrypted with one key can only be decrypted with the other. RSA and elliptic curve cryptography (ECC) are the common examples.

The public key can be distributed freely. The private key is kept secret by its owner.

Asymmetric encryption solves key distribution: you can encrypt a message using my public key and only I can decrypt it with my private key. We never needed a prior secure channel.

The tradeoff: asymmetric operations are computationally expensive relative to symmetric operations. They are not practical for encrypting large data volumes directly.

### The hybrid model

Real protocols combine both. Asymmetric cryptography is used to securely exchange a symmetric session key. Symmetric encryption then handles the actual data.

TLS is the canonical example. During the handshake, asymmetric cryptography establishes a shared session key. All subsequent traffic is encrypted with that symmetric key. You get key distribution without a pre-shared secret, and bulk encryption without the overhead of asymmetric operations on every byte.

This is the design pattern worth understanding deeply. It shows up in TLS, in S/MIME, and in most well-designed encryption protocols.

---

## Hashing addresses integrity — not confidentiality, not authenticity

A hash function takes arbitrary input and produces a fixed-length digest. SHA-256 produces a 256-bit output regardless of whether the input is a single character or a multi-gigabyte file.

Hash functions are one-directional: you cannot recover the input from the hash. They are also deterministic: the same input always produces the same hash.

Hashing verifies integrity. If the hash of a downloaded file matches the published hash, the file has not been modified.

What hashing does not provide: authenticity. Anyone can compute a hash. If an attacker can modify a file and also replace the published hash, integrity checking fails. Hashing on its own is only useful when the hash value is delivered through a trusted channel or protected by another mechanism.

One common engineering mistake is treating hashing and encryption as interchangeable for password storage. They are not:

- **Encrypting passwords** means the original value can be recovered if you have the key. That is the wrong property for password storage. You should never need to recover the original password.
- **Hashing passwords** (with a slow, salted algorithm like bcrypt or Argon2) means the original cannot be recovered. You re-hash the login attempt and compare. That is the right property.

Calling `SHA-256(password)` directly is also insufficient — unsalted hashes are vulnerable to precomputation attacks (rainbow tables). Password hashing requires purpose-built algorithms with built-in salt and computational cost.

---

## HMAC adds authenticity to integrity

A Message Authentication Code (MAC) — specifically an HMAC (Hash-based MAC) — combines a hash function with a shared secret key. The output can only be produced by someone who holds the key.

This provides:

- **Integrity:** The message has not been modified.
- **Authenticity:** The message was created by a party that holds the secret key.

HMAC is used in signed JWTs (when using HS256), in API request signing, and in many protocol-level message verification schemes.

What it does not provide: **non-repudiation**. Because both the sender and receiver share the same key, either party could have generated the MAC. The receiver cannot prove to a third party that the sender — and not the receiver — created it.

<figure>
  <img src="{{ site.baseurl }}/assets/generated/2026/04/cissp-cryptography-primitives-not-magic/mac-vs-signature.svg" alt="Side-by-side comparison: HMAC using a shared secret key proves integrity and authenticity but not non-repudiation. Digital signature using an asymmetric key pair proves integrity, authenticity, and non-repudiation.">
  <figcaption>HMAC and digital signatures both verify who sent a message — but only digital signatures provide non-repudiation because only one party holds the signing key.</figcaption>
</figure>

---

## Digital signatures add non-repudiation

Digital signatures use asymmetric cryptography in the opposite direction from encryption.

- The sender signs with their **private key**.
- Anyone with the sender's **public key** can verify the signature.

Because only the sender has the private key, the signature can only have been produced by them. This provides:

- **Integrity:** The signed content has not been altered.
- **Authenticity:** The content was signed by the private key holder.
- **Non-repudiation:** The private key holder cannot credibly deny having signed it, because no one else could have produced that signature.

Digital signatures are used in code signing, certificate chains (a certificate is a signed binding of a public key to an identity), document signing, and asymmetric JWT signing (RS256, ES256).

The CISSP understanding here: if a scenario requires non-repudiation, the answer involves asymmetric cryptography and digital signatures, not HMAC with a shared secret.

---

## Key management is where things actually go wrong

The primitives described above are well understood and implemented in mature, well-audited libraries. Algorithm failures in production systems are rare.

What is common: key management failures.

- Keys stored in source code, configuration files, or environment variables with insufficient access control.
- Keys never rotated, so a compromise of a key from three years ago still affects current data.
- Encryption keys protected by other keys in a chain, where the ultimate trust anchor — the root key — gets little operational attention.
- Certificate expiration causing outages, because certificate lifecycle management was not treated as an operational discipline.
- Key generation using inadequate entropy sources, particularly in constrained environments.

CISSP treats key management as a significant component of the cryptography domain. The exam tests concepts like:

- **Key generation:** Keys must be generated with sufficient randomness (entropy). Weak key generation is a systemic weakness.
- **Key distribution:** How keys get to the parties that need them. The asymmetric key exchange model exists to solve this.
- **Key storage:** Where private keys and symmetric keys live, and who can reach them. Hardware Security Modules (HSMs) are the enterprise answer for high-value keys.
- **Key rotation and revocation:** Keys should have defined lifetimes. When compromised, they must be revocable. Certificate Revocation Lists (CRLs) and OCSP are the mechanisms for public key infrastructure.
- **Key destruction:** Secure deletion at end of life, to prevent recovery from decommissioned hardware.

The pattern across all of these: the cryptographic algorithms rarely fail. The processes around the keys routinely do.

---

## The CISSP exam framing

CISSP does not ask you to implement AES or generate RSA key pairs. It asks you to reason about cryptographic systems.

Common scenario types:

**"Which of the following provides non-repudiation?"**
Answer: Digital signatures (asymmetric). Not HMAC. Not symmetric encryption.

**"A user encrypts a file with the recipient's public key. What does this ensure?"**
Answer: Confidentiality — only the recipient's private key can decrypt. It does not prove who sent it or that it was unmodified.

**"What is the primary weakness of symmetric encryption?"**
Answer: Key distribution. Both parties need the same key, but getting it to them securely is the challenge.

**"Which algorithm is most appropriate for encrypting a large file?"**
Answer: Symmetric encryption (AES). Asymmetric encryption is computationally inappropriate for bulk data.

**"An organization needs to verify software was released by a trusted vendor. Which control applies?"**
Answer: Digital signatures / code signing. The vendor's private key signs the release; the public key allows verification without revealing the private key.

The exam mindset: match the security property to the primitive, match the primitive to the scenario.

---

## The table worth keeping in mind

| Primitive | Provides | Does not provide |
|---|---|---|
| Symmetric encryption (AES) | Confidentiality | Key distribution, integrity, authenticity |
| Asymmetric encryption (RSA, ECC) | Confidentiality, key distribution | Efficiency at scale |
| Hashing (SHA-256) | Integrity | Authenticity, non-repudiation |
| HMAC | Integrity, authenticity | Non-repudiation |
| Digital signature | Integrity, authenticity, non-repudiation | Bulk confidentiality |
| Hybrid encryption (TLS model) | Confidentiality + key distribution | *(combines the first two)* |

<figure>
  <img src="{{ site.baseurl }}/assets/generated/2026/04/cissp-cryptography-primitives-not-magic/tls-handshake.svg" alt="Simplified TLS handshake diagram showing asymmetric key exchange establishing a shared symmetric session key, which then encrypts all subsequent data.">
  <figcaption>TLS uses asymmetric cryptography to solve key distribution and symmetric cryptography for bulk data. The hybrid model gets the best of both primitives.</figcaption>
</figure>

---

## The practical takeaway

You do not need to implement any of these primitives. Use well-maintained libraries and reviewed protocols. Do not build your own encryption.

What you do need to understand:

- Which goal are you trying to achieve? Confidentiality? Integrity? Authenticity? Non-repudiation?
- Which primitive addresses that goal?
- What does it not address, and does your system design account for that?
- Where are your keys, who can access them, and what happens if they are compromised?

When you look at a system design — a token signing scheme, a file encryption approach, a message verification mechanism — you should be able to trace each security property to the control that provides it. Gaps in that mapping are vulnerabilities, not implementation details.

Cryptography is not magic. It is a set of tools with precise guarantees. Engineering soundly with it means knowing which tool provides which guarantee — and not assuming that one tool does the job of all five.

---

*This post is part of my CISSP study series — working through the domains and writing up what actually sticks. Domain 3: Security Architecture and Engineering.*

<!--
---

**Meta description:** Cryptography covers symmetric and asymmetric encryption, hashing, HMAC, and digital signatures — each providing different security properties. This post maps each primitive to what it does and does not guarantee, with CISSP exam framing and engineering examples.

**SEO keyword ideas:**
- symmetric vs asymmetric encryption explained
- CISSP cryptography domain 3
- digital signatures vs HMAC non-repudiation
- TLS hybrid encryption model
- key management best practices security

-->

---

## 4. LinkedIn post

Cryptography is one of those topics engineers use every day without thinking about it.

TLS on every API call. Hashed passwords. Signed tokens. Code signing on every deployment.

But when you need to evaluate a system design or answer a CISSP question — "which control provides non-repudiation?" — the vocabulary matters.

The key insight: cryptography is not one thing. It is a set of primitives, each solving a specific problem.

**Encryption** → confidentiality (only the intended recipient can read it)
**Hashing** → integrity (the data hasn't changed)
**HMAC** → integrity + authenticity (it came from someone with the shared key)
**Digital signatures** → integrity + authenticity + non-repudiation (only one party could have signed it)

The distinction between HMAC and digital signatures trips up a lot of CISSP candidates — and a lot of engineers evaluating JWT signing options.

HMAC uses a shared secret. Both parties can produce the same MAC. Neither can prove the other created it.

A digital signature uses a private key. Only the signer could have produced it. That asymmetry is what non-repudiation requires.

TLS pulls it all together with the hybrid model: asymmetric crypto for key exchange, symmetric crypto for bulk data. You get key distribution without pre-shared secrets plus efficiency at scale.

The practical question for any system design: which security property are you trying to achieve, and does the control you picked actually provide it?

Gaps there are vulnerabilities. Not implementation details.

What is one place in a system you've worked on where the cryptographic primitive and the security goal were mismatched?

#cissp #cryptography #securityarchitecture #softwareengineering #infosec

---

## 5. Extra content assets

### Hero image
- **File:** `/assets/generated/2026/04/cissp-cryptography-primitives-not-magic/hero.svg`
- **Alt text:** Diagram mapping four cryptographic goals — confidentiality, integrity, authenticity, and non-repudiation — to the primitives that address each one.
- **Caption:** Cryptography is a set of tools. Each primitive solves a specific problem. Knowing which is which is more useful than memorizing algorithm names.

### Inline image 1 (MAC vs signature)
- **File:** `/assets/generated/2026/04/cissp-cryptography-primitives-not-magic/mac-vs-signature.svg`
- **Alt text:** Side-by-side comparison of HMAC and digital signature workflows and what each provides.
- **Caption:** HMAC and digital signatures both verify who sent a message — but only digital signatures provide non-repudiation.

### Inline image 2 (TLS handshake)
- **File:** `/assets/generated/2026/04/cissp-cryptography-primitives-not-magic/tls-handshake.svg`
- **Alt text:** Simplified TLS handshake diagram showing asymmetric key exchange followed by symmetric session encryption.
- **Caption:** TLS uses asymmetric cryptography to solve key distribution and symmetric cryptography for bulk data.

### Social snippets
- "Cryptography is not a single control. It is a set of primitives, each addressing a specific security property."
- "HMAC proves who sent a message — but both parties can produce the MAC. That is why digital signatures exist."
- "TLS is the hybrid model in practice: asymmetric for key exchange, symmetric for everything after."
- "Key management is where cryptographic systems actually fail. The algorithms rarely do."
