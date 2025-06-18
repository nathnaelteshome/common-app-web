/**
 * Search Service for Universities and Programs
 *
 * This service provides high-level search functionality for the application,
 * managing search indices and providing optimized search operations.
 */

import { SearchIndex, type SearchResult, type SearchOptions } from "./search-algorithm"
import type { University, Program } from "@/lib/api/types"
import { getAllPrograms, getUniversities, getUniversitiesByCategory } from "@/data/universities-data"

// Extended interfaces for search
interface SearchableUniversity extends University {
  popularity: number
}

interface SearchableProgram extends Program {
  popularity: number
  universityName?: string
  location?: string
}

/**
 * University Search Service
 * Manages university search with pre-built index for performance
 */
class UniversitySearchService {
  private searchIndex: SearchIndex<SearchableUniversity>
  private lastIndexUpdate = 0
  private readonly INDEX_REFRESH_INTERVAL = 5 * 60 * 1000 // 5 minutes

  constructor() {
    this.searchIndex = new SearchIndex<SearchableUniversity>()
    this.buildIndex()
  }

  /**
   * Builds or rebuilds the search index
   * Called automatically when needed
   */
  private buildIndex(): void {
    // For now, return empty array since we need to implement API call
    // This would need to fetch universities from API
    const universities: University[] = []
    const searchableUniversities: SearchableUniversity[] = universities.map((uni) => ({
      ...uni,
      popularity: uni.profile.total_students + uni.profile.rankings.rating * 1000,
      keywords: [
        uni.shortName,
        uni.profile.university_type,
        uni.profile.address.region,
        ...uni.programs.map((p) => p.type),
        ...uni.profile.facilities,
        ...uni.profile.accreditation,
      ],
    }))

    this.searchIndex.build(searchableUniversities)
    this.lastIndexUpdate = Date.now()
  }

  /**
   * Checks if index needs refresh and rebuilds if necessary
   */
  private ensureIndexFresh(): void {
    if (Date.now() - this.lastIndexUpdate > this.INDEX_REFRESH_INTERVAL) {
      console.log("Refreshing university search index...")
      this.buildIndex()
    }
  }

  /**
   * Searches universities with advanced algorithm
   *
   * @param query - Search query
   * @param options - Search configuration
   * @param customUniversities - Optional custom dataset to search within
   * @returns Ranked search results
   */
  search(query: string, options: SearchOptions = {}, customUniversities?: University[]): SearchResult<University>[] {
    // If custom universities provided, create temporary index
    if (customUniversities) {
      const tempIndex = new SearchIndex<SearchableUniversity>()
      const searchableUniversities: SearchableUniversity[] = customUniversities.map((uni) => ({
        ...uni,
        popularity: uni.totalStudents + uni.rating * 1000,
        keywords: [
          uni.shortName,
          uni.type,
          uni.region,
          ...uni.programs.map((p) => p.type),
          ...uni.facilities,
          ...uni.accreditations,
        ],
      }))
      tempIndex.build(searchableUniversities)

      const defaultOptions: SearchOptions = {
        fuzzyThreshold: 2,
        minScore: 0.1,
        maxResults: 20,
        boostFactors: {
          name: 4.0,
          type: 2.5,
          location: 2.0,
          description: 1.0,
        },
        enableFuzzy: true,
        enablePhonetic: true,
      }

      const mergedOptions = { ...defaultOptions, ...options }
      const results = tempIndex.search(query, mergedOptions)

      return results.map((result) => ({
        ...result,
        item: result.item as University,
      }))
    }

    this.ensureIndexFresh()

    const defaultOptions: SearchOptions = {
      fuzzyThreshold: 2,
      minScore: 0.1,
      maxResults: 20,
      boostFactors: {
        name: 4.0, // University name is most important
        type: 2.5, // Public/Private type
        location: 2.0, // Location/region
        description: 1.0, // Description has lower priority
      },
      enableFuzzy: true,
      enablePhonetic: true,
    }

    const mergedOptions = { ...defaultOptions, ...options }

    console.log(`🔍 Searching universities: "${query}"`)
    const results = this.searchIndex.search(query, mergedOptions)

    console.log(`✅ Found ${results.length} university results`)
    return results.map((result) => ({
      ...result,
      item: result.item as University, // Remove the popularity extension
    }))
  }

  /**
   * Gets search suggestions based on partial query
   *
   * @param query - Partial query
   * @returns Suggested search terms
   */
  getSuggestions(query: string): string[] {
    if (query.length < 2) return []

    this.ensureIndexFresh()

    const results = this.search(query, {
      maxResults: 5,
      minScore: 0.3,
      boostFactors: { name: 5.0, type: 1.0, location: 2.0, description: 0.5 },
    })

    return results.map((result) => result.item.name)
  }
}

/**
 * Program Search Service
 * Manages program search with enhanced context
 */
class ProgramSearchService {
  private searchIndex: SearchIndex<SearchableProgram>
  private lastIndexUpdate = 0
  private readonly INDEX_REFRESH_INTERVAL = 5 * 60 * 1000 // 5 minutes

  constructor() {
    this.searchIndex = new SearchIndex<SearchableProgram>()
    this.buildIndex()
  }

  /**
   * Builds program search index with university context
   */
  private buildIndex(): void {
    const programs = getAllPrograms()
    const searchablePrograms: SearchableProgram[] = programs.map((program) => ({
      ...program,
      popularity: program.availableSeats + (program.universityRating || 4.0) * 100,
      keywords: [
        program.type,
        program.degree,
        program.universityName || "",
        program.location || "",
        ...program.requirements,
      ],
    }))

    this.searchIndex.build(searchablePrograms)
    this.lastIndexUpdate = Date.now()
  }

  /**
   * Ensures index is up to date
   */
  private ensureIndexFresh(): void {
    if (Date.now() - this.lastIndexUpdate > this.INDEX_REFRESH_INTERVAL) {
      console.log("Refreshing program search index...")
      this.buildIndex()
    }
  }

  /**
   * Searches programs with university context
   *
   * @param query - Search query
   * @param options - Search configuration
   * @returns Ranked search results
   */
  search(query: string, options: SearchOptions = {}): SearchResult<SearchableProgram>[] {
    this.ensureIndexFresh()

    const defaultOptions: SearchOptions = {
      fuzzyThreshold: 2,
      minScore: 0.15,
      maxResults: 30,
      boostFactors: {
        name: 5.0, // Program name is most important
        type: 3.0, // Program type (Engineering, etc.)
        description: 1.5, // Program description
        location: 1.0, // University location
      },
      enableFuzzy: true,
      enablePhonetic: true,
    }

    const mergedOptions = { ...defaultOptions, ...options }

    console.log(`🔍 Searching programs: "${query}"`)
    const results = this.searchIndex.search(query, mergedOptions)

    console.log(`✅ Found ${results.length} program results`)
    return results
  }

  /**
   * Gets program suggestions
   *
   * @param query - Partial query
   * @returns Suggested program names
   */
  getSuggestions(query: string): string[] {
    if (query.length < 2) return []

    this.ensureIndexFresh()

    const results = this.search(query, {
      maxResults: 8,
      minScore: 0.3,
      boostFactors: { name: 6.0, type: 2.0, description: 1.0, location: 0.5 },
    })

    return results.map((result) => result.item.name)
  }
}

// Singleton instances
export const universitySearchService = new UniversitySearchService()
export const programSearchService = new ProgramSearchService()

/**
 * Combined search function for both universities and programs
 *
 * @param query - Search query
 * @param options - Search options
 * @returns Combined results with type indicators
 */
export function searchAll(query: string, options: SearchOptions = {}) {
  const universityResults = universitySearchService.search(query, {
    ...options,
    maxResults: Math.floor((options.maxResults || 20) * 0.6), // 60% universities
  })

  const programResults = programSearchService.search(query, {
    ...options,
    maxResults: Math.floor((options.maxResults || 20) * 0.4), // 40% programs
  })

  return {
    universities: universityResults,
    programs: programResults,
    total: universityResults.length + programResults.length,
  }
}

/**
 * Get search suggestions for autocomplete
 *
 * @param query - Partial query
 * @returns Combined suggestions
 */
export function getSearchSuggestions(query: string): {
  universities: string[]
  programs: string[]
} {
  return {
    universities: universitySearchService.getSuggestions(query),
    programs: programSearchService.getSuggestions(query),
  }
}

/**
 * Advanced search with multiple filters
 *
 * @param filters - Search filters
 * @returns Filtered university results
 */
export function advancedSearch(filters: {
  query?: string
  programType?: string
  location?: string
  universityType?: string
  degreeType?: string
  category?: string
}) {
  let results = getUniversities()

  // Apply category filter first if specified
  if (filters.category) {
    results = getUniversitiesByCategory(filters.category)
  }

  // Apply text search if query exists
  if (filters.query) {
    const searchResults = universitySearchService.search(filters.query, {}, results)
    results = searchResults.map((result) => result.item)
  }

  // Apply additional filters
  if (filters.programType) {
    results = results.filter((uni) => uni.programs.some((program) => program.type === filters.programType))
  }

  if (filters.location) {
    results = results.filter((uni) => uni.region === filters.location)
  }

  if (filters.universityType) {
    results = results.filter((uni) => uni.type === filters.universityType)
  }

  if (filters.degreeType) {
    results = results.filter((uni) => uni.programs.some((program) => program.degree === filters.degreeType))
  }

  return results
}
