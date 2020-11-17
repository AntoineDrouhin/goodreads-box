import dotenv from 'dotenv'
import Formatter from './formatter'
import Github from './github'
import Goodreads from './goodreads'

dotenv.config()

async function main() {
  try {
    const goodreads = new Goodreads()

    const books = await goodreads.getBooks()
    console.log(`Found ${books.length} book(s)`)

    const formatter = new Formatter()
    const lines = formatter.generateLines(books)

    const github = new Github()
    const url = await github.updateGist(
      `📚 Currently reading books (${lines.length}／${books.length})`,
      lines.join('\n')
    )

    console.log(`Updated: ${url}`)
  } catch (error) {
    console.error(error)
    process.exit(1)
  }
}

main()
