import React from "react";
import Helmet from "react-helmet";
import { graphql } from "gatsby";
import { Row } from "react-bootstrap";
import styled from "@emotion/styled";
import Layout from "../components/layout";
import HeroHeader from "../components/portfolio/heroHeader";
import IndexBuilder from "../components/page-builders/index-builder";
import Transition from "../components/util/transition";
import {
  angularGradient,
  herowaves
} from "../../static/assets/svg/hardcoded-svgs";

const GraphicWave = styled.div`
  position: fixed;
  top: 0px;
  left: 0px;
  opacity: 0;
  z-index: -1;
`;

const StickyForeground = styled.div`
  z-index: -2;
  height: 100%;
  width: 100%;
  left: 0px;
  top: 0px;
  position: sticky;
  background: ${props => props.theme.colors.primary};
`;
const PageContent = styled.main`
  margin: 0px;
  z-index: 1;
  position: relative;
  width: 100%;
  height: 100%;
  pointer-events: none; //this element overlaps the heroheader interactables, so we disable events on this element, and enable them for all child elements
  & * {
    pointer-events: auto;
  } //enable for all child elements

  padding-top: 200px;
  background: linear-gradient(
    0deg,
    ${props => props.theme.colors.contentForeground} 80%,
    rgba(0, 0, 0, 0) 80%
  );
`;

// <video preload="true" controls loop autoPlay="true">
//                       <source src="https://imgur.com/5QFU0PB.mp4" />
//                     </video>
// const Highlight = styled.div`
//   display: inline;
//   overflow: hidden;
//   height: 100%;
//   font-size: 1.2em;
//   margin-left: -12.5px;
//   padding: 0px 12.5px;
//   ${props => props.theme.mixins.bold};
//   z-index: -1;
// `;

const IndexPage = React.memo(
  ({
    data: {
      site,
      allMarkdownRemark: { edges }
    }
  }) => {
    return (
      <Layout pageType="">
      {/**mailchimp integration
      <script id="mcjs">!function(c,h,i,m,p){m=c.createElement(h),p=c.getElementsByTagName(h)[0],m.async=1,m.src=i,p.parentNode.insertBefore(m,p)}(document,"script","https://chimpstatic.com/mcjs-connected/js/users/fbbcaa0fa5cc9f5e4f2ae3d09/a9757ed9e8d1f6abfc04086cf.js");</script>
      */}

        <Helmet>
          <title>{site.siteMetadata.title}</title>
          <meta name="description" content={site.siteMetadata.description} />
        </Helmet>

        <HeroHeader
          headerGraphic="./assets/svg/portfolio-graphic.png"
          headlineDescription="I create software applications for online businesses like you, so you can focus on getting your users needs fulfilled"
          headline={(
            <>
              Beautiful, scalable
              <br />
              software.
            </>
          )}
        />

        <PageContent>
          <Transition />

          <IndexBuilder />
        </PageContent>

        <GraphicWave dangerouslySetInnerHTML={{ __html: herowaves }} />
      </Layout>
    );
  }
);
// {Posts}

export default IndexPage;
export const pageQuery = graphql`
  query indexPageQuery {
    site {
      siteMetadata {
        title
        description
      }
    }
    allMarkdownRemark(sort: { order: DESC, fields: [frontmatter___date] }) {
      edges {
        node {
          id
          excerpt(pruneLength: 250)
          frontmatter {
            date(formatString: "MMMM DD, YYYY")
            path
            title
            thumbnail_
          }
        }
      }
    }
  }
`;
