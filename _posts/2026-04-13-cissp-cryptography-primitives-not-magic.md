---
layout: post
title: "CISSP #28: Cryptography Is Not Magic — Understanding the Primitives That Secure Everything"
date: 2026-04-13 13:00:00 +0000
categories: [security, cissp]
tags: [cissp, domain-3, cryptography, encryption, digital-signatures, tls, key-management]
excerpt: "Cryptography is not a single control. It is a set of primitives — symmetric encryption, hashing, HMAC, digital signatures — each providing distinct guarantees. Knowing which primitive provides which property is the foundation of sound security architecture."
image: /assets/generated/2026/04/cissp-cryptography-primitives-not-magic/hero.svg
---

Developers use cryptographic tools constantly without thinking about them.

You hash passwords before storing them. Your API calls go over TLS. You sign tokens, verify certificates, and see references to AES-256 or SHA-256 in documentation without stopping to reason carefully about what those choices actually provide.

That works very well — until you need to make a cryptographic decision yourself, evaluate whether a system design is sound, or answer a CISSP question about which primitive provides non-repudiation and why.

Cryptography is not a single thing. It is a collection of distinct primitives, each solving a specific problem. The practical skill — for engineers and for the CISSP exam — is knowing which primitive addresses which problem, what it does not address, and how the primitives combine in the protocols you already rely on.

<figure>
  <img src="{{ site.baseurl }}/assets/generated/2026/04/cissp-cryptography-primitives-not-magic/hero.svg" alt="Diagram mapping four cryptographic goals — confidentiality, integrity, authenticity, and non-repudiation — to the primitives that address each one: symmetric encryption, hashing, HMAC, and digital signatures.">
  <figcaption>Cryptography is a set of tools. Each primitive solves a specific problem. Knowing which is which is more useful than memorizing algorithm names.</figcaption>
</figure>

## Start with the goals, not the algorithms

The right entry point is not AES or RSA. It is the security properties you are trying to achieve.

**Confidentiality:** Only the intended recipient can read the data.

**Integrity:** The data has not been altered in transit or at rest.

**Authenticity:** The data came from the expected sender.

**Non-repudiation:** The sender cannot later deny having sent the data.

These are distinct properties. No single cryptographic primitive provides all of them. A system that needs all four requires a combination of tools.

This framing is exactly what CISSP tests: given a scenario, which property applies, and which primitive delivers it?

## Encryption addresses confidentiality — nothing else by default

Encryption transforms plaintext into ciphertext that can only be reversed with the correct key. Its purpose is confidentiality: preventing unauthorized parties from reading the data.

Encryption alone does not verify that the ciphertext was unmodified. It does not prove who sent it. It does not prevent the sender from denying they sent it.

Two families of encryption matter for CISSP:

### Symmetric encryption

One key is used for both encryption and decryption. AES (Advanced Encryption Standard) is the dominant example in modern systems.

Symmetric encryption is fast and efficient — appropriate for bulk data encryption. But it requires that both parties already share the same key. Getting that key to the other party securely is the key distribution problem, and it is the fundamental limitation of symmetric encryption.

### Asymmetric encryption

Two mathematically linked keys: a public key and a private key. Data encrypted with one key can only be decrypted with the other. RSA and elliptic curve cryptography are the common examples.

The public key can be distributed freely. The private key is kept secret by its owner.

Asymmetric encryption solves key distribution: you can encrypt a message using my public key, and only I can decrypt it with my private key. We never needed a prior secure channel to share a secret.

The tradeoff: asymmetric operations are computationally expensive relative to symmetric operations. They are not suited for encrypting large volumes of data.

### The hybrid model

Real protocols combine both. Asymmetric cryptography is used to securely exchange a symmetric session key. Symmetric encryption then handles the actual data.

TLS is the canonical example. During the handshake, asymmetric cryptography establishes a shared session key. All subsequent traffic is encrypted with that symmetric key. You get key distribution without a pre-shared secret, and bulk encryption without the overhead of asymmetric operations on every byte.

This is the design pattern worth internalizing. It appears in TLS, in PGP, in S/MIME, and in most well-designed encryption protocols.

## Hashing addresses integrity — not confidentiality, not authenticity

A hash function takes arbitrary input and produces a fixed-length digest. SHA-256 produces a 256-bit output regardless of whether the input is a single character or a multi-gigabyte file.

Hash functions are one-directional: you cannot recover the input from the hash. They are also deterministic: the same input always produces the same hash.

Hashing verifies integrity. If the hash of a downloaded file matches the published hash, the file has not been modified in transit.

What hashing does not provide: authenticity. Anyone can compute a hash. If an attacker can modify a file and also replace the published hash, integrity checking fails. Hashing on its own is only useful when the hash value arrives through a trusted channel or is protected by a separate mechanism.

One common engineering mistake is treating hashing and encryption as interchangeable for password storage. They are not:

- **Encrypting passwords** means the original value can be recovered if you have the key. You should never need to recover the original password.
- **Hashing passwords** with a slow, salted algorithm like bcrypt or Argon2 means the original cannot be recovered. You re-hash the login attempt and compare. That is the correct property.

SHA-256(password) directly is also insufficient — unsalted hashes are vulnerable to precomputation attacks (rainbow tables). Password hashing requires purpose-built algorithms with built-in salt and computational cost.

## HMAC adds authenticity to integrity

A Message Authentication Code (MAC) — specifically HMAC (Hash-based MAC) — combines a hash function with a shared secret key. The output can only be produced by someone who holds the key.

This provides:

- **Integrity:** The message has not been modified.
- **Authenticity:** The message was created by a party that holds the secret key.

HMAC is used in signed JWTs when using HS256, in API request signing, and in various protocol-level message verification schemes.

What it does not provide: **non-repudiation**. Because both the sender and receiver share the same key, either party could have generated the MAC. The receiver cannot prove to a third party that the sender — and not the receiver — created it.

<figure>
  <img src="{{ site.baseurl }}/assets/generated/2026/04/cissp-cryptography-primitives-not-magic/mac-vs-signature.svg" alt="Side-by-side comparison: HMAC using a shared secret key proves integrity and authenticity but not non-repudiation. Digital signature using an asymmetric key pair proves integrity, authenticity, and non-repudiation.">
  <figcaption>HMAC and digital signatures both verify who sent a message — but only digital signatures provide non-repudiation because only one party holds the signing key.</figcaption>
</figure>

## Digital signatures add non-repudiation

Digital signatures use asymmetric cryptography in the reverse direction from encryption.

- The sender signs with their **private key**.
- Anyone with the sender's **public key** can verify the signature.

Because only the sender holds the private key, the signature can only have been produced by them. This provides:

- **Integrity:** The signed content has not been altered.
- **Authenticity:** The content was signed by the private key holder.
- **Non-repudiation:** The private key holder cannot credibly deny having signed it — no one else could have produced that signature.

Digital signatures are used in code signing, certificate chains (a certificate is a signed binding of a public key to an identity), document signing, and asymmetric JWT signing (RS256, ES256).

CISSP reasoning: if a scenario requires non-repudiation, the answer involves asymmetric cryptography and digital signatures, not HMAC with a shared secret.

## The hybrid model in practice: how TLS actually works

<figure>
  <img src="{{ site.baseurl }}/assets/generated/2026/04/cissp-cryptography-primitives-not-magic/tls-handshake.svg" alt="Simplified TLS handshake diagram showing asymmetric key exchange establishing a shared symmetric session key, which then encrypts all subsequent data.">
  <figcaption>TLS uses asymmetric cryptography to solve key distribution and symmetric cryptography for bulk data. The hybrid model gets the best of both primitives.</figcaption>
</figure>

Each HTTPS connection demonstrates the hybrid model:

1. The server presents a certificate (its public key signed by a Certificate Authority).
2. The client verifies the certificate chain and trusts the server's public key.
3. Asymmetric cryptography is used to establish a shared session key — without transmitting it in plaintext.
4. All subsequent data is encrypted with that symmetric session key.

The result: key distribution is solved without a pre-shared secret. Bulk data is encrypted efficiently. Both primitives contribute what they do well.

## Key management is where things actually go wrong

The algorithms in use today — AES, RSA, ECDH, SHA-256 — are well understood and implemented in well-audited libraries. Algorithmic failures in production are rare.

What is common: key management failures.

- Keys stored in source code, configuration files, or environment variables without sufficient access control.
- Keys never rotated, so a compromise from a previous period still affects current data.
- Certificate expiration causing outages, because certificate lifecycle management was not treated as an operational discipline.
- Encryption keys stored in a system that is itself insufficiently secured.

CISSP covers key management as a substantial component of the cryptography domain:

- **Key generation:** Keys must be generated with sufficient entropy. Weak generation is a systemic weakness, not just a one-time error.
- **Key distribution:** How keys reach the parties that need them. The asymmetric exchange model exists specifically to solve this.
- **Key storage:** Hardware Security Modules (HSMs) are the enterprise answer for protecting high-value keys in tamper-resistant hardware.
- **Key rotation and revocation:** Keys should have defined lifetimes. When compromised, they must be revocable. Certificate Revocation Lists (CRLs) and OCSP provide this for public key infrastructure.
- **Key destruction:** Secure deletion at end of life, to prevent key recovery from decommissioned hardware or storage media.

The pattern: the cryptographic primitives rarely fail. The processes around the keys routinely do.

## What CISSP tests on cryptography

CISSP does not ask you to implement AES or generate key pairs in code. It tests your ability to reason about cryptographic systems and match choices to requirements.

Common exam scenario types:

**"Which of the following provides non-repudiation?"**
Digital signatures (asymmetric). Not HMAC. Not symmetric encryption.

**"A file is encrypted with the recipient's public key. What does this ensure?"**
Confidentiality — only the recipient's private key decrypts it. It does not prove who sent the file or that it was unmodified in transit.

**"What is the primary limitation of symmetric encryption?"**
Key distribution. Both parties need the same shared key, but getting it to them securely is the challenge.

**"Which is most appropriate for encrypting a 5GB backup file?"**
Symmetric encryption (AES). Asymmetric operations are computationally inappropriate for bulk data at scale.

**"An organization needs to verify that software was released by the expected vendor."**
Digital signatures / code signing. The vendor's private key signs the artifact. The public key verifies it without exposing the private key.

The exam mindset: match the security property required to the primitive that delivers it.

## The reference table

| Primitive | Provides | Does not provide |
|---|---|---|
| Symmetric encryption (AES) | Confidentiality | Key distribution, integrity, authenticity |
| Asymmetric encryption (RSA, ECC) | Confidentiality, key distribution | Efficiency at bulk scale |
| Hashing (SHA-256) | Integrity | Authenticity, non-repudiation |
| HMAC | Integrity, authenticity | Non-repudiation |
| Digital signature | Integrity, authenticity, non-repudiation | Bulk confidentiality |
| Hybrid encryption (TLS model) | Confidentiality + key distribution | *(combines symmetric and asymmetric)* |

## The practical takeaway

Cryptography is not magic, and it is not a single control. It is a set of tools with precise, limited guarantees.

When you look at a system design — a token signing scheme, a file encryption approach, a message integrity mechanism — you should be able to trace each security property to the control that provides it. Gaps in that mapping are vulnerabilities.

For the CISSP exam: understand the primitives, understand what each provides and does not provide, and reason about which one fits each scenario. The exam tests that reasoning — not your ability to name algorithm specifications or write cryptographic code.

For production systems: use well-maintained libraries, reviewed protocols, and treat key management as an ongoing operational discipline, not a configuration step you visit once during initial setup.

---

*This post is part of my CISSP study series — working through the domains and writing up what actually sticks. Domain 3: Security Architecture and Engineering.*
