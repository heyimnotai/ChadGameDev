# Analytics Integration API Reference

## Event Categories

| Category | Purpose | Examples |
|----------|---------|----------|
| Session | Track app usage patterns | app_open, app_close, session_duration |
| Progression | Track player advancement | level_start, level_complete, level_fail |
| Economy | Track resource flow | currency_earned, currency_spent, item_purchased |
| Engagement | Track feature usage | tutorial_step, menu_opened, feature_used |
| Error | Track issues | crash, error, warning |
| Business | Track monetization | iap_initiated, iap_completed, ad_watched |

## Retention Benchmarks (2025)

| Metric | Median | Top 25% | Target |
|--------|--------|---------|--------|
| D1 | 26-28% | 31-33% | 45%+ |
| D7 | 3-4% | 7-8% | 20%+ |
| D30 | <3% | 5-7% | 10%+ |

## A/B Test Sample Sizes

| Minimum Detectable Effect | Confidence | Power | Sample per Variant |
|---------------------------|------------|-------|-------------------|
| 5% relative change | 95% | 80% | 6,400 |
| 10% relative change | 95% | 80% | 1,600 |
| 20% relative change | 95% | 80% | 400 |
| 5% relative change | 99% | 80% | 10,000 |

## Test Duration Requirements

| Metric Type | Minimum Duration | Recommended |
|-------------|------------------|-------------|
| Session metrics | 3 days | 7 days |
| D7 retention | 10 days | 14 days |
| D30 retention | 33 days | 45 days |
| LTV | 60 days | 90 days |

## Event Naming Rules

- Use snake_case: `level_complete`, not `LevelComplete`
- Event names < 40 characters
- Parameter keys < 40 characters
- Parameter values < 100 characters
- Max 25 parameters per event

## Standard Funnels

### FTUE Funnel
1. App Opened (session_start)
2. Tutorial Started (tutorial_step, step=1)
3. Tutorial Steps 2-5
4. Tutorial Complete
5. First Level Started
6. First Level Complete

### Conversion Funnel
1. Store Opened
2. Product Viewed
3. Purchase Initiated
4. Purchase Completed

## Cohort Dimensions

| Dimension | Use Case |
|-----------|----------|
| install_date | Time-based cohorts |
| install_version | Version comparison |
| acquisition_source | Marketing attribution |
| country | Regional analysis |
| ab_test_group | Experiment segmentation |
| player_segment | Behavioral targeting |

## Player Segments

| Segment | Criteria |
|---------|----------|
| whale | totalSpend > $100 |
| dolphin | totalSpend > $10 |
| minnow | totalSpend > $0 |
| engaged_free | sessions >= 5/week, levels >= 10 |
| casual_free | sessions >= 3/week |
| progressing | levels >= 5 |
| new_user | Default |
