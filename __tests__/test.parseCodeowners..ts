// parseCodeowners.test.ts
import { parseCodeowners } from './parseCodeowners'

describe('parseCodeowners', () => {
  it('should correctly parse codeowners string', () => {
    const content = 'user1, 1\nuser2, 2\nuser3, 3\n'
    const expected = {
      user1: 1,
      user2: 2,
      user3: 3
    }

    const result = parseCodeowners(content)

    expect(result).toEqual(expected)
  })

  it('should ignore empty lines', () => {
    const content = 'user1, 1\n\nuser2, 2\n\n'
    const expected = {
      user1: 1,
      user2: 2
    }

    const result = parseCodeowners(content)

    expect(result).toEqual(expected)
  })
})
