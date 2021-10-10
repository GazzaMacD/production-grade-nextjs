import React from 'react'
import { Pane, majorScale } from 'evergreen-ui'
import matter from 'gray-matter'
import path from 'path'
import fs from 'fs'
import orderby from 'lodash.orderby'
import Container from '../../components/container'
import HomeNav from '../../components/homeNav'
import PostPreview from '../../components/postPreview'
import { posts as postsFromCMS } from '../../content'

const Blog = ({ posts }) => {
  return (
    <Pane>
      <header>
        <HomeNav />
      </header>
      <main>
        <Container>
          {posts.map((post) => (
            <Pane key={post.title} marginY={majorScale(5)}>
              <PostPreview post={post} />
            </Pane>
          ))}
        </Container>
      </main>
    </Pane>
  )
}

Blog.defaultProps = {
  posts: [],
}

export default Blog

export async function getStaticProps(ctx) {
  //read the posts from the posts dir
  const postsDir = path.join(process.cwd(), 'posts')
  const filenames = fs.readdirSync(postsDir)
  const filePosts = filenames.map((filename) => {
    const filePath = path.join(postsDir, filename)
    return fs.readFileSync(filePath, 'utf-8')
  })
  // get published or draft depending on ctx.previw cookie
  const cmsPosts = ctx.preview ? postsFromCMS.draft : postsFromCMS.published

  // merge posts from cms and from file system and sort by pub date
  const posts = orderby(
    [...cmsPosts, ...filePosts].map((content: string) => {
      //extract frontmatter from markdown content
      const { data } = matter(content)
      return data
    }),
    ['publishedOn'],
    ['desc'],
  ) // end orderby
  return { props: { posts } }
}

/**
 * Need to get the posts from the
 * fs and our CMS
 */
