import React from "react";
import Helmet from "react-helmet";
import { graphql } from "gatsby";
import styled from "@emotion/styled";
import { Row, Col } from "react-bootstrap";
import Layout from "../components/layout";

export default function Template({
  data // this prop will be injected by the GraphQL query below.
}) {
  const { site, markdownRemark } = data; // data.markdownRemark holds your post data
  const { siteMetadata } = site;
  const { frontmatter, html } = markdownRemark;

  // alert(JSON.stringify(data));

  return (
    <Layout pageType="blog">
      <Row noGutters>
        <Col xl={1} />
        <Col xl={10}>
          <Post src={frontmatter.thumbnail_}>
            {!frontmatter.thumbnail_ && (
              <>
                <div className="post-thumbnail" />
                <div className="post-details">
                  <h1 className="post-title">{frontmatter.title}</h1>
                  <div className="post-meta">{frontmatter.date}</div>
                </div>
              </>
            )}
            {!!frontmatter.thumbnail_ && (
              <>
                <div className="post-details">
                  <h1 className="post-title">{frontmatter.title}</h1>
                  <div className="post-meta">{frontmatter.date}</div>
                </div>
                <div className="post-thumbnail" />
              </>
            )}
          </Post>
          <BlogContent dangerouslySetInnerHTML={{ __html: html }} />
        </Col>
        <Col xl={1} />
      </Row>
    </Layout>
  );
}

export const pageQuery = graphql`
  query($path: String!) {
    site {
      siteMetadata {
        title
      }
    }
    markdownRemark(frontmatter: { path: { eq: $path } }) {
      html
      frontmatter {
        date(formatString: "MMMM DD, YYYY")
        path
        title
        thumbnail_
        template
        metaDescription
        catagory
      }
      tableOfContents
      timeToRead
    }
  }
`;

//       <Helmet>
//         <title>
//           {frontmatter.title}
// {' '}
// |
// {siteMetadata.title}
//         </title>
//         <meta name="description" content={frontmatter.metaDescription} />
//       </Helmet>

// border-top: 1px solid
//   ${props =>
//     props.theme.name === "dark"
//       ? "rgba(255, 255, 255, 0.25)"
//       : "rgba(0, 0, 0, 0.25)"};

const BlogContent = styled.section`
  margin-top: 25px;
  font-family: "brown";
  padding: 100px 7vw;
  color: ${props => props.theme.colors.textSecondary};

  & * {
    line-height: 175%;
  }

  & .carousel {
    display: flex;
    flex-direction: row;
  }
  & .image-grid {
    display: grid;
    grid-template-columns: 1fr 1fr 1fr;
  }

  & h1 {
    font-size: 1.5em;
    margin-bottom: 25px;
    margin-top: 50px;
    font-family: "brown";
    font-weight: bolder;
  }
  & h2 {
    font-size: 1.5em;
    margin-top: 50px;
    font-weight: bolder;
    margin-bottom: 25px;
    font-family: "brown";
  }
  & h3 {
    font-weight: bolder;
    font-size: 1.5em;
    margin-top: 50px;
    margin-bottom: 25px;
    font-family: "brown";
  }
`;

const Post = styled.article`
  margin-top: 150px;
  color: ${props => props.theme.colors.textSecondary};
  padding: 100px 7vw;
  display: flex;
  flex-direction: row;
  order: 0;

  & .post-details {
    flex: auto;
    padding: 25px;

    & .post-title {
      color: ${props => props.theme.colors.textSecondary};
      z-index: 3;
      font-weight: bolder;
      text-transform: capitalcase;
      font-family: "brown-bold";

      text-align: left;
      margin: auto;
      font-size: 3em;
      margin-bottom: 25px;
      font-family: "brown";
    }
    & .post-meta {
      font-family: "brown";
      color: ${props => props.theme.colors.textThird};
    }
  }
  & .post-thumbnail {
    flex: 75%;
    position: relative;
    order: 1;
    height: 500px;
    background-image: url(${props => props.src});
    background-size: cover;
    background-position: center;
    background-repeat: no-repeat;
    // &:before {
    //   content: "";
    //   position: absolute;
    //   top: 0;
    //   opacity: 0.25;
    //   left: 0;
    //   width: 100%;
    //   height: 100%;
    //   z-index: 1;
    // }
  }
`;
