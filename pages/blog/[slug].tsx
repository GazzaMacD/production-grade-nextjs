import React, { FC } from 'react'
import hydrate from 'next-mdx-remote/hydrate'
import { majorScale, Pane, Heading, Spinner } from 'evergreen-ui'
import Head from 'next/head'
import { useRouter } from 'next/router'
import { Post } from '../../types'
import Container from '../../components/container'
import HomeNav from '../../components/homeNav'
import path from 'path'
import fs from 'fs'
import matter from 'gray-matter'
import { posts } from '../../content'
import renderToString from 'next-mdx-remote/render-to-string'

const BlogPost: FC<Post> = ({ source, frontMatter }) => {
  const router = useRouter()
  let content
  if (source) {
    content = hydrate(source)
  }

  if (router.isFallback) {
    return (
      <Pane width="100%" height="100%">
        <Spinner size={48} />
      </Pane>
    )
  }
  return (
    <Pane>
      <Head>
        <title>{`Known Blog | ${frontMatter.title}`}</title>
        <meta name="description" content={frontMatter.summary} />
      </Head>
      <header>
        <HomeNav />
      </header>
      <main>
        <Container>
          <Heading fontSize="clamp(2rem, 8vw, 6rem)" lineHeight="clamp(2rem, 8vw, 6rem)" marginY={majorScale(3)}>
            {frontMatter.title}
          </Heading>
          <Pane>{content}</Pane>
        </Container>
      </main>
    </Pane>
  )
}

BlogPost.defaultProps = {
  source: '',
  frontMatter: { title: 'default title', summary: 'summary', publishedOn: '' },
}

export function getStaticPaths() {
  const postsDir = path.join(process.cwd(), 'posts')
  const fileNames = fs.readdirSync(postsDir)
  const slugs = fileNames.map((fileName) => {
    const filePath = path.join(postsDir, fileName)
    const file = fs.readFileSync(filePath, 'utf-8')
    const { data } = matter(file)
    return data.slug
  })
  return {
    paths: slugs.map((slug) => {
      return {
        params: {
          slug: slug,
        },
      }
    }),
    fallback: true,
  }
}

export async function getStaticProps({ params }) {
  let post
  try {
    const filePath = path.join(process.cwd(), 'posts', params.slug + '.mdx')
    const file = fs.readFileSync(filePath, 'utf-8')
    post = matter(file)
  } catch {
    const cmsPosts = posts.published.map((post) => {
      return matter(post)
    })
    post = cmsPosts.find((post) => {
      return post.data.slug === params.slug
    })
  } // catch
  const { data } = post
  const mdxSource = await renderToString(post.content)

  return {
    props: {
      source: mdxSource,
      frontMatter: data,
    },
  }
}

/**
 * Need to get the paths here
 * then the the correct post for the matching path
 * Posts can come from the fs or our CMS
 */
export default BlogPost
