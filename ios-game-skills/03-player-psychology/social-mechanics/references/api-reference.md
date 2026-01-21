# Social Mechanics - API Reference

## Leaderboard Display Principles

| Element | Recommendation | Psychological Basis |
|---------|----------------|---------------------|
| Default view | Friends-only or percentile | Avoids discouragement from global elites |
| Player position | Always visible, centered | Provides reference point |
| Neighbors shown | 5 above, 5 below | Creates achievable goals |
| Rank format | Percentile > Raw rank | "Top 15%" beats "Rank 42,372" |
| Update frequency | End of session | Prevents obsessive checking |
| Reset period | Weekly or seasonal | Fresh starts maintain engagement |

## Leaderboard Types and Use Cases

| Type | Best For | Avoid For |
|------|----------|-----------|
| Global all-time | Showcasing dedication | Casual games |
| Global weekly | Competitive games | Games with pay-to-win elements |
| Friends only | Social motivation | Games without friend systems |
| Local/regional | Cultural connection | Small player bases |
| Percentile | All competitive games | When exact rank matters |
| Skill-based tiers | Ranked modes | Casual modes |

## Competition vs Cooperation Balance

| Game Type | Competition % | Cooperation % |
|-----------|---------------|---------------|
| Battle royale | 90% | 10% (squad modes) |
| Match-3 puzzle | 40% (leaderboards) | 60% (lives sharing) |
| RPG | 50% (PvP arena) | 50% (guilds, raids) |
| Casual | 20% (optional) | 80% (helping, sharing) |
| Strategy | 60% (battles) | 40% (alliances) |

## Guild Size Tiers

| Size | Type | Management | Benefits |
|------|------|------------|----------|
| 5-10 | Friends group | Minimal | Basic chat, shared progress |
| 15-30 | Small clan | Officer roles | Donations, basic events |
| 30-50 | Standard guild | Full hierarchy | All features, guild wars |
| 50-100 | Large guild | Complex management | Maximum benefits, prestige |

## Guild Feature Progression

| Guild Level | Members | Features |
|-------------|---------|----------|
| Level 1 | 5 | Chat, member list, basic donations |
| Level 2 | 10 | Guild bank, simple quests, recruitment |
| Level 3 | 20 | Officer roles, guild events, custom emblem |
| Level 4 | 30 | Guild wars, advanced perks, alliances |
| Level 5 | 50 | Guild bosses, territory control, leaderboard ranking |

## Guild Role Permissions

| Role | Max Count | Permissions |
|------|-----------|-------------|
| Leader | 1 | All permissions, transfer leadership, disband |
| Officer | 2-5 | Accept/reject/kick members, promote to elder, start events, announcements |
| Elder | 5-10 | Accept applications, chat moderation |
| Member | Unlimited | Participate, donate, use chat |

## Share Trigger Moments

| Moment | Share Rate | Content |
|--------|------------|---------|
| New high score | 15-25% | Score + visual |
| Achievement unlock | 10-20% | Achievement badge |
| Level complete | 5-10% | Level + score |
| Epic loot drop | 20-30% | Item showcase |
| Milestone reached | 25-35% | Progress milestone |

## Privacy Levels

| Level | Name | Visibility |
|-------|------|------------|
| 1 | Full Public | Name, score, activity visible to all |
| 2 | Friends Only (Default) | Visible to friends only |
| 3 | Private | Anonymous on leaderboards, no activity |
| 4 | Offline | No social features, single-player only |

## Required Opt-Out Options

| Feature | Must Allow Opt-Out | Default State |
|---------|-------------------|---------------|
| Leaderboards | Yes | Opt-in |
| Friend activity | Yes | Opt-in |
| Push notifications | Yes | Opt-in |
| Location sharing | Yes | Opt-out |
| Score sharing | Yes | Opt-in |
| Guild membership | Yes | Not joined |

## Async Multiplayer Patterns

| Pattern | Description | Example |
|---------|-------------|---------|
| Ghost racing | Race against friend's recorded run | Mario Kart Time Trials |
| Base raiding | Attack offline player's setup | Clash of Clans |
| Challenge sharing | Send custom challenges | Words with Friends |
| Leaderboard competition | Compete on scores | Candy Crush |
| Gift/request economy | Exchange resources | FarmVille |

## Friend Challenge Types

| Type | Duration | Stakes | Loser Experience |
|------|----------|--------|------------------|
| Quick challenge | 1 game | Bragging rights | "Rematch?" option |
| Daily challenge | 24 hours | Small rewards | Participation reward |
| Weekly challenge | 7 days | Medium rewards | Consolation prize |
| Season challenge | 30 days | Major rewards | Progress recognition |

## Social Proof Types

| Type | Implementation | Impact |
|------|----------------|--------|
| Activity indicators | "1,247 playing now" | FOMO, validation |
| Friend activity | "Alex just beat Level 15" | Competition, reconnection |
| Popular items | "Most purchased this week" | Decision simplification |
| Achievement rarity | "Only 3% have this" | Status, motivation |
| Trending content | "Hot levels right now" | Discovery, relevance |

## Activity Counter Display Thresholds

| Player Count | Display Format |
|--------------|----------------|
| < 100 | Don't show (embarrassing) |
| 100-999 | Show exact number |
| 1,000-9,999 | Show as "1.2K" |
| 10,000+ | Show as "10K+" |

## Referral System Rewards

| Event | Referrer Reward | Referee Reward |
|-------|-----------------|----------------|
| Install | 100 soft currency | 2x starting resources |
| Reach level 10 | 500 soft currency | Exclusive starter item |
| First 30 days | 5% of referee IAP (soft equiv) | Auto-friend with referrer |

**Limits**: 50 referrals per player, referee must play 3+ days for verification.

## Viral Loop Metrics

| Metric | Description | Target |
|--------|-------------|--------|
| Share rate | Shares / shareable moments | Track per moment type |
| Click-through rate | Clicks / shares | Optimize share content |
| Install rate | Installs / clicks | Optimize app store page |
| K-factor | Viral coefficient | > 0.3 for organic growth |
