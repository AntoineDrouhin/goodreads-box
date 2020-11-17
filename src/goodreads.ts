import xml from 'fast-xml-parser'
import he from 'he'
import got from 'got'
import { ensureArray } from './type-utils'

export default class Goodreads {

  private request = got.extend({
    prefixUrl: 'https://www.goodreads.com',
    searchParams: {
      v: 2,
      key: process.env.GOODREADS_API_KEY,
    },
  })

  public async getBooks(): Promise<Book[]> {
    let reviewList: Goodreads.Review[]
    try {
      reviewList = await this.getReviewList()
    } catch (error) {
      throw new Error("Error while fetching review list: " + error)
    }

    const reviews = await Promise.all(
      reviewList.map(({ id }) => this.getReviewShow(id))
    )

    const books = reviews
      .map(({ id, book, date_updated, user_statuses }) => {
        const latestStatus = Array.isArray(user_statuses?.user_status)
          ? user_statuses?.user_status[0]
          : user_statuses?.user_status
        return {
          id: id,
          title: he.decode(book.title),
          percent: latestStatus?.percent || 0,
          date: new Date(latestStatus?.updated_at || date_updated),
        }
      })
      .sort((a, b) => {
        if (process.env.BOOKS_SORT_BY === 'percent') {
          return b.percent - a.percent
        }
        return b.date.getTime() - a.date.getTime()
      })
    return books
  }

  private async getReviewList(
    shelf = 'currently-reading'
  ): Promise<Goodreads.Review[]> {
    const res = await this.request
      .get('review/list', {
        searchParams: {
          id: process.env.GOODREADS_USER_ID,
          shelf,
        },
      })
      .text()

    const reviewList: Goodreads.ReviewList = xml.parse(res)
    // reviews.review can be an array or an item 
    const reviews = ensureArray(reviewList.GoodreadsResponse.reviews.review)
    return reviews
  }

  private async getReviewShow(id: number): Promise<Goodreads.Review> {
    const res = await this.request.get('review/show', { searchParams: { id } }).text()
    const reviewShow: Goodreads.ReviewShow = xml.parse(res)
    const review = reviewShow.GoodreadsResponse.review
    return review
  }
}
