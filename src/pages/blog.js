import React from "react";
import Helmet from "react-helmet";
import styled from "@emotion/styled";
import { StaticQuery } from "gatsby";
import { useTheme } from "emotion-theming";
import Layout from "../components/layout";
import BlogBuilder from "../components/page-builders/blog-builder";
// <GraphicWave dangerouslySetInnerHTML={{ __html: lhs }} />
import ThreeBlog from "../components/blog/three-blog";

const ThreeWrapper = styled.div`
  position: absolute;
  height: 100%;
  width: 100%;
  overflow: hidden;
  top: 0px;
  z-index: 1;
`;

const blogPage = React.memo(() => {
  // const Posts = edges
  //   .filter(edge => !!edge.node.frontmatter.date) // You can filter your posts based on some criteria
  //   .map(edge => <PostLink key={edge.node.id} post={edge.node} />);
  const theme = useTheme();

  return (
    <Layout pageType="blog">
      <Spacer />
      <ThreeWrapper id="three-blog">
        <ThreeBlog theme={theme} />
      </ThreeWrapper>
      <BlogBuilder />
    </Layout>
  );
});

const Spacer = styled.br`
  width: 100%;
  margin-top: 250px;
  position: relative;
`;

export default blogPage;
