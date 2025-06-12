export interface SearchableItem {
  id: string
  name: string
  description?: string
  type?: string
  location?: string
  keywords?: string[]
  popularity?: number
  rating?: number
}

export interface SearchResult<T> {
  item: T
  score: number
  matchedFields: string[]
  matchType: "exact" | "fuzzy" | "partial" | "phonetic"
  relevanceScore: number
}

export interface SearchOptions {
  fuzzyThreshold?: number // Maximum edit distance for fuzzy matching (default: 2)
  minScore?: number // Minimum score to include in results (default: 0.1)
  maxResults?: number // Maximum number of results (default: 50)
  boostFactors?: {
    // Field importance multipliers
    name?: number
    description?: number
    type?: number
    location?: number
  }
  enableFuzzy?: boolean // Enable fuzzy matching (default: true)
  enablePhonetic?: boolean // Enable phonetic matching (default: true)
}

/**
 * PREPROCESSING UTILITIES
 * ======================
 */

/**
 * Normalizes text for consistent searching
 * - Converts to lowercase
 * - Removes accents and special characters
 * - Trims whitespace
 *
 * @param text - Input text to normalize
 * @returns Normalized text
 */
export function normalizeText(text: string): string {
  return text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "") // Remove accents
    .replace(/[^\w\s]/g, " ") // Replace special chars with spaces
    .replace(/\s+/g, " ") // Collapse multiple spaces
    .trim()
}

/**
 * Tokenizes text into searchable terms
 * - Splits on whitespace
 * - Filters out short words (< 2 chars)
 * - Removes common stop words
 *
 * @param text - Text to tokenize
 * @returns Array of tokens
 */
export function tokenize(text: string): string[] {
  const stopWords = new Set(["the", "a", "an", "and", "or", "but", "in", "on", "at", "to", "for", "of", "with", "by"])

  return normalizeText(text)
    .split(" ")
    .filter((token) => token.length >= 2 && !stopWords.has(token))
}

/**
 * DISTANCE ALGORITHMS
 * ==================
 */

/**
 * Calculates Levenshtein distance between two strings
 * Used for fuzzy matching to find similar words
 *
 * ALGORITHM: Dynamic Programming
 * TIME COMPLEXITY: O(m * n)
 * SPACE COMPLEXITY: O(min(m, n))
 *
 * @param a - First string
 * @param b - Second string
 * @returns Edit distance between strings
 */
export function levenshteinDistance(a: string, b: string): number {
  if (a.length === 0) return b.length
  if (b.length === 0) return a.length

  // Use shorter string for space optimization
  if (a.length > b.length) [a, b] = [b, a]

  let previousRow = Array.from({ length: a.length + 1 }, (_, i) => i)

  for (let i = 1; i <= b.length; i++) {
    const currentRow = [i]

    for (let j = 1; j <= a.length; j++) {
      const cost = a[j - 1] === b[i - 1] ? 0 : 1
      currentRow[j] = Math.min(
        previousRow[j] + 1, // deletion
        currentRow[j - 1] + 1, // insertion
        previousRow[j - 1] + cost, // substitution
      )
    }

    previousRow = currentRow
  }

  return previousRow[a.length]
}

/**
 * Calculates Jaro-Winkler similarity for phonetic matching
 * Better for names and proper nouns
 *
 * @param s1 - First string
 * @param s2 - Second string
 * @returns Similarity score (0-1)
 */
export function jaroWinklerSimilarity(s1: string, s2: string): number {
  if (s1 === s2) return 1.0
  if (s1.length === 0 || s2.length === 0) return 0.0

  const matchWindow = Math.floor(Math.max(s1.length, s2.length) / 2) - 1
  if (matchWindow < 0) return 0.0

  const s1Matches = new Array(s1.length).fill(false)
  const s2Matches = new Array(s2.length).fill(false)

  let matches = 0
  let transpositions = 0

  // Find matches
  for (let i = 0; i < s1.length; i++) {
    const start = Math.max(0, i - matchWindow)
    const end = Math.min(i + matchWindow + 1, s2.length)

    for (let j = start; j < end; j++) {
      if (s2Matches[j] || s1[i] !== s2[j]) continue
      s1Matches[i] = s2Matches[j] = true
      matches++
      break
    }
  }

  if (matches === 0) return 0.0

  // Count transpositions
  let k = 0
  for (let i = 0; i < s1.length; i++) {
    if (!s1Matches[i]) continue
    while (!s2Matches[k]) k++
    if (s1[i] !== s2[k]) transpositions++
    k++
  }

  const jaro = (matches / s1.length + matches / s2.length + (matches - transpositions / 2) / matches) / 3

  // Winkler prefix bonus
  let prefix = 0
  for (let i = 0; i < Math.min(s1.length, s2.length, 4); i++) {
    if (s1[i] === s2[i]) prefix++
    else break
  }

  return jaro + 0.1 * prefix * (1 - jaro)
}

/**
 * SEARCH INDEX
 * ============
 */

/**
 * Search index for fast lookups
 * Pre-processes items for efficient searching
 */
export class SearchIndex<T extends SearchableItem> {
  private items: T[] = []
  private tokenIndex: Map<string, Set<number>> = new Map()
  private normalizedItems: Array<{
    id: string
    normalizedName: string
    normalizedDescription: string
    normalizedType: string
    normalizedLocation: string
    tokens: string[]
  }> = []

  /**
   * Builds search index from items
   * Creates inverted index for O(1) token lookups
   *
   * @param items - Items to index
   */
  build(items: T[]): void {
    console.time("Search Index Build")

    this.items = items
    this.tokenIndex.clear()
    this.normalizedItems = []

    items.forEach((item, index) => {
      // Normalize all searchable fields
      const normalizedName = normalizeText(item.name)
      const normalizedDescription = normalizeText(item.description || "")
      const normalizedType = normalizeText(item.type || "")
      const normalizedLocation = normalizeText(item.location || "")

      // Create combined text for tokenization
      const combinedText = [
        normalizedName,
        normalizedDescription,
        normalizedType,
        normalizedLocation,
        ...(item.keywords || []),
      ].join(" ")

      const tokens = tokenize(combinedText)

      // Store normalized item
      this.normalizedItems[index] = {
        id: item.id,
        normalizedName,
        normalizedDescription,
        normalizedType,
        normalizedLocation,
        tokens,
      }

      // Build inverted index
      tokens.forEach((token) => {
        if (!this.tokenIndex.has(token)) {
          this.tokenIndex.set(token, new Set())
        }
        this.tokenIndex.get(token)!.add(index)
      })
    })

    console.timeEnd("Search Index Build")
    console.log(`Indexed ${items.length} items with ${this.tokenIndex.size} unique tokens`)
  }

  /**
   * MAIN SEARCH FUNCTION
   * ===================
   *
   * Performs multi-stage search with relevance scoring
   *
   * SEARCH STAGES:
   * 1. Exact token matching (fastest)
   * 2. Fuzzy matching for typos
   * 3. Partial substring matching
   * 4. Phonetic matching for names
   *
   * @param query - Search query
   * @param options - Search configuration
   * @returns Ranked search results
   */
  search(query: string, options: SearchOptions = {}): SearchResult<T>[] {
    console.time("Search Execution")

    const {
      fuzzyThreshold = 2,
      minScore = 0.1,
      maxResults = 50,
      boostFactors = {
        name: 3.0,
        description: 1.0,
        type: 2.0,
        location: 1.5,
      },
      enableFuzzy = true,
      enablePhonetic = true,
    } = options

    if (!query.trim()) {
      console.timeEnd("Search Execution")
      return []
    }

    const queryTokens = tokenize(query)
    const normalizedQuery = normalizeText(query)
    const results: SearchResult<T>[] = []
    const processedItems = new Set<number>()

    console.log(`Searching for: "${query}" (${queryTokens.length} tokens)`)

    // STAGE 1: Exact token matching
    console.time("Exact Matching")
    const exactCandidates = new Set<number>()

    queryTokens.forEach((token) => {
      const matches = this.tokenIndex.get(token)
      if (matches) {
        matches.forEach((index) => exactCandidates.add(index))
      }
    })

    exactCandidates.forEach((index) => {
      const result = this.scoreItem(index, queryTokens, normalizedQuery, boostFactors, "exact")
      if (result.score >= minScore) {
        results.push(result)
        processedItems.add(index)
      }
    })
    console.timeEnd("Exact Matching")

    // STAGE 2: Fuzzy matching
    if (enableFuzzy && results.length < maxResults) {
      console.time("Fuzzy Matching")

      for (let index = 0; index < this.normalizedItems.length; index++) {
        if (processedItems.has(index)) continue

        const item = this.normalizedItems[index]
        let hasFuzzyMatch = false

        // Check fuzzy matches against tokens
        for (const queryToken of queryTokens) {
          for (const itemToken of item.tokens) {
            const distance = levenshteinDistance(queryToken, itemToken)
            if (distance <= fuzzyThreshold && distance > 0) {
              hasFuzzyMatch = true
              break
            }
          }
          if (hasFuzzyMatch) break
        }

        if (hasFuzzyMatch) {
          const result = this.scoreItem(index, queryTokens, normalizedQuery, boostFactors, "fuzzy")
          if (result.score >= minScore) {
            results.push(result)
            processedItems.add(index)
          }
        }
      }
      console.timeEnd("Fuzzy Matching")
    }

    // STAGE 3: Partial matching
    if (results.length < maxResults) {
      console.time("Partial Matching")

      for (let index = 0; index < this.normalizedItems.length; index++) {
        if (processedItems.has(index)) continue

        const item = this.normalizedItems[index]
        const searchableText = [
          item.normalizedName,
          item.normalizedDescription,
          item.normalizedType,
          item.normalizedLocation,
        ].join(" ")

        if (searchableText.includes(normalizedQuery) || queryTokens.some((token) => searchableText.includes(token))) {
          const result = this.scoreItem(index, queryTokens, normalizedQuery, boostFactors, "partial")
          if (result.score >= minScore) {
            results.push(result)
            processedItems.add(index)
          }
        }
      }
      console.timeEnd("Partial Matching")
    }

    // STAGE 4: Phonetic matching
    if (enablePhonetic && results.length < maxResults) {
      console.time("Phonetic Matching")

      for (let index = 0; index < this.normalizedItems.length; index++) {
        if (processedItems.has(index)) continue

        const item = this.normalizedItems[index]
        let hasPhoneticMatch = false

        // Check phonetic similarity for names (most important)
        const nameSimilarity = jaroWinklerSimilarity(normalizedQuery, item.normalizedName)
        if (nameSimilarity > 0.7) {
          hasPhoneticMatch = true
        }

        if (hasPhoneticMatch) {
          const result = this.scoreItem(index, queryTokens, normalizedQuery, boostFactors, "phonetic")
          if (result.score >= minScore) {
            results.push(result)
            processedItems.add(index)
          }
        }
      }
      console.timeEnd("Phonetic Matching")
    }

    // Sort by relevance score (descending)
    results.sort((a, b) => b.relevanceScore - a.relevanceScore)

    console.timeEnd("Search Execution")
    console.log(`Found ${results.length} results, returning top ${Math.min(maxResults, results.length)}`)

    return results.slice(0, maxResults)
  }

  /**
   * SCORING ALGORITHM
   * ================
   *
   * Calculates relevance score for an item
   * Combines multiple factors for accurate ranking
   *
   * SCORING FACTORS:
   * - Match quality (exact > fuzzy > partial > phonetic)
   * - Field importance (name > type > location > description)
   * - Popularity boost (student count, rating)
   * - Query coverage (how many query terms matched)
   *
   * @param index - Item index
   * @param queryTokens - Tokenized query
   * @param normalizedQuery - Normalized query string
   * @param boostFactors - Field importance multipliers
   * @param matchType - Type of match found
   * @returns Scored search result
   */
  private scoreItem(
    index: number,
    queryTokens: string[],
    normalizedQuery: string,
    boostFactors: Required<SearchOptions>["boostFactors"],
    matchType: SearchResult<T>["matchType"],
  ): SearchResult<T> {
    const item = this.items[index]
    const normalizedItem = this.normalizedItems[index]

    let score = 0
    const matchedFields: string[] = []

    // Base score by match type
    const matchTypeScores = {
      exact: 1.0,
      fuzzy: 0.8,
      partial: 0.6,
      phonetic: 0.4,
    }

    const baseScore = matchTypeScores[matchType]

    // Field-specific scoring
    const fields = [
      { name: "name", text: normalizedItem.normalizedName, boost: boostFactors.name! },
      { name: "type", text: normalizedItem.normalizedType, boost: boostFactors.type! },
      { name: "location", text: normalizedItem.normalizedLocation, boost: boostFactors.location! },
      { name: "description", text: normalizedItem.normalizedDescription, boost: boostFactors.description! },
    ]

    fields.forEach((field) => {
      let fieldScore = 0

      // Exact query match
      if (field.text.includes(normalizedQuery)) {
        fieldScore = 1.0
        matchedFields.push(field.name)
      }
      // Token matches
      else {
        const tokenMatches = queryTokens.filter((token) => field.text.includes(token))
        if (tokenMatches.length > 0) {
          fieldScore = tokenMatches.length / queryTokens.length
          matchedFields.push(field.name)
        }
      }

      score += fieldScore * field.boost
    })

    // Query coverage bonus
    const coverage = matchedFields.length / fields.length
    score *= 1 + coverage * 0.5

    // Popularity boost
    let popularityBoost = 1.0
    if (item.popularity) {
      popularityBoost += Math.log10(item.popularity) * 0.1
    }
    if (item.rating) {
      popularityBoost += (item.rating / 5) * 0.2
    }

    const finalScore = baseScore * score * popularityBoost

    return {
      item,
      score: finalScore,
      matchedFields: [...new Set(matchedFields)],
      matchType,
      relevanceScore: finalScore,
    }
  }
}

/**
 * CONVENIENCE FUNCTIONS
 * ====================
 */

/**
 * Creates and builds a search index
 * @param items - Items to index
 * @returns Ready-to-use search index
 */
export function createSearchIndex<T extends SearchableItem>(items: T[]): SearchIndex<T> {
  const index = new SearchIndex<T>()
  index.build(items)
  return index
}

/**
 * Performs a quick search without building persistent index
 * Good for one-off searches or small datasets
 *
 * @param items - Items to search
 * @param query - Search query
 * @param options - Search options
 * @returns Search results
 */
export function quickSearch<T extends SearchableItem>(
  items: T[],
  query: string,
  options: SearchOptions = {},
): SearchResult<T>[] {
  const index = createSearchIndex(items)
  return index.search(query, options)
}
