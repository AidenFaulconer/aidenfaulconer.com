import React, { useState, useEffect, useCallback, useRef } from "react";
import { Row, Col, Pagination, Media } from "react-bootstrap";
import styled from "@emotion/styled";

import stickybits from "stickybits";
import { Icon, InlineIcon } from "@iconify/react";
import projectsIcon from "@iconify/icons-ic/baseline-work";
import skillsIcon from "@iconify/icons-fa-solid/clipboard-list";
import experienceIcon from "@iconify/icons-fa-solid/road";
import backgroundIcon from "@iconify/icons-ic/sharp-person-pin";
import contactIcon from "@iconify/icons-bx/bxs-contact";
import * as ConicGradient from "conic-gradient";

import { StaticQuery, graphql } from "gatsby";

// #region svg icons
import filterIcon from "@iconify/icons-mdi/filter-variant";
import { useTheme } from "emotion-theming";
import { Btn, BtnPrimary, BtnSecondary } from "./buttons";
// #endregion svg icons

// #region blog card
export const Projects = ({ sectionName }) => {
  const [selected, selectProject] = useState(0);

  return <> </>;
};
// #endregion blog card

// #region section builder
// keys must be Capitalized for react to render them
const sections = {
  Projects: React.memo(Projects),
  Test: React.memo(Projects),
  Test1: React.memo(Projects),
};
const sectionIcons = {
  Projects: projectsIcon,
  Test: projectsIcon,
  Test1: projectsIcon,
};

const mockData = [
  {
    mediaSrc: "./assets/becca-tapert-sY5RjMB1KkE-unsplash.jpg",
    title: "title",
    description: "description"
  }
];

export const catagories = ["technology", "design", "workflow", "discovery"];

export default React.memo(() => {
  const [currentSection, setCurrentSection] = useState("Projects");
  const [featuredBlog, setFeaturedBlog] = useState(0);
  const sectionRefs = useRef({});

  const scrollToSection = useCallback(elem => {
    if (typeof window !== "undefined") {
      window.scrollBy(0, -115);
    } // adjust scrolling with negative value
    sectionRefs.current[elem].scrollIntoView({ behavior: "smooth" });
    setCurrentSection(elem);
  });

  useEffect(() => {
    stickybits("#sticky", { useStickyClasses: true });
  }, []);

  const theme = useTheme();
  // https://www.npmjs.com/package/react-intersection-observer#polyfill

  // handle a section coming into view
  useEffect(() => {
    console.log(currentSection);
  }, [currentSection]);

  return (
    <StaticQuery
      //       //       query={graphql`
      query={blogPageQuery}
      render={data => {
        const catagoryMappings = {};
        console.log(data);

        return (
          <>
            <Spacer />
            <Row noGutters>
              <Col
                xl={1}
                lg={1}
                md={1}
                className="d-sm-none d-md-none d-lg-block"
              />
              <Col xl={6} lg={6} md={6}>
                <FeaturedBlog src={mockData[featuredBlog].mediaSrc}>
                  <img src={mockData[featuredBlog].mediaSrc} />
                  <h1>{mockData[featuredBlog].title}</h1>
                  <p>{mockData[featuredBlog].description}</p>
                  <button>read more</button>
                </FeaturedBlog>
              </Col>

              <Col xl lg md>
                <ContentContainer>
                  {Object.keys(sections).map((sectionName, i) => {
                    const RenderSection = sections[sectionName];
                    return (
                      <div
                        className="section-card"
                        key={sectionName}
                        id={sectionName}
                        ref={ref => {
                          sectionRefs.current[sectionName] = ref;
                        }}
                      >
                        <div className="header">
                          <InlineIcon icon={sectionIcons[sectionName]} />
                          <p>{sectionName}</p>
                        </div>
                        <RenderSection sectionName={sectionName} />
                      </div>
                    );
                  })}

                  <Col xl lg md className="d-sm-none d-md-none d-lg-block" />
                </ContentContainer>
              </Col>

              <Col
                xl={2}
                lg={2}
                style={{ marginTop: "0px" }}
                className="d-xs-none d-sm-none d-md-none d-lg-block "
              >
                <img
                  className="graphic"
                  src={`./assets/svg/blog-graphic-${theme.name}.png`} // TODO: this will be dynamic per page (with a hero header)
                />
              </Col>

              <Col
                xl={1}
                lg={1}
                md={1}
                className="d-sm-none d-md-none d-lg-block"
              />

              <Col xl={12}>
                <FilterBar>
                  <Icon icon={filterIcon} />
                  {catagories.map(catagory => (
                    <p>{catagory}</p>
                  ))}
                </FilterBar>
              </Col>
            </Row>
          </>
        );
      }}
    />
  );
});
// #endregion section builder
const FeaturedBlog = styled.article`
  position:relative;
  width: 832px;
  height: 484px;
  background: ${props => props.theme.colors.primary};
  box-shadow: ${props => props.theme.shadows.primary};
  color: ${props => props.theme.colors.textPrimary};

  & img {
    object-fit: fit;
    position: realative;
    top: 0px;
    left: 0px;
    height: 100%;
    width: 35%;
  }

    &::after {
      position: absolute;
      content: "";
      width: 100%;
      height: 100%;
      object-fit: cover;
      background-image: url(${props => props.src});
      left: 0px;
      top: 0px;
      opacity: 0.6;
      z-index: -3;
      transform: rotate(-2deg);
      box-shadow: ${props => props.theme.shadows.primary};
    }

  & h1 {
    position: absolute;
    top: 0px;
    right: 0px;
  }
  & p {
    top: 0px;
    right: 0px;
    position: absolute;
  }
  & button {
    top: 0px;
    right: 0px;
    position: absolute;
  }
`;

const ContentContainer = styled.section`
  position: relative;
  z-index: 1;
  display: flex;
  flex-direction: column;
  color: ${props => props.theme.colors.textColor};

  // & *[class*="col"] {//add gutters
  //        column-gap: 25px;
  //        margin-top: 25px;
  //   }

    & .section-card {
      background: ${props => props.theme.colors.primary};
      position:relative;
      margin-bottom: 8px;
      width: 200px;
      height: 160px;
      display: flex;
      background: ${props => props.theme.colors.contentColor};
      border-radius: ${props => props.theme.corners.borderRadius1};


    & .header {
      width:100%;
      color: ${props => props.theme.colors.textColor};
      background: ${props => props.theme.colors.innerContentColor};
      border-radius: 10px 10px 0px 0px;
      position: absolute;
      top:1px;
      left:0px;
      padding: 12.5px;
      padding-bottom: 3.125px;
      z-index: 1;
      overflow: hidden;



      & p {
        position: relative;
        display:inline-block;
        width: 50%;
        margin-top:-3px;
      }

      & svg {
        margin-right: 6.25px;
      }
    }
   }

    ${props =>
      props.theme.breakpoints.lg(`
      `)}
    //customize the responsiveness of each section card
      & #Projects {
    }
    & #Skills {
    display: flex;
    flex-direction: row;
    }
    & #Experience {
      flex-direction: column;
      justify-content: space-evenly;
    }
    & #Background {
      flex-direction: row;
    }
    & #Contact {
      flex-direction: row;
    }
  }
  & *[class*="row"] {
  }
`;
const SectionBreak = styled.hr`
  z-index: 2;
  position: relative;
  top: 0px;
`;

const Spacer = styled.br`
  width: 100%;
  margin-top: 250px;
  position: relative;
`;

const FilterBar = styled.div`
border-radius: ${props => props.theme.corners.borderRadius2};
background: ${props => props.theme.colors.textPrimary};
flex-direction: row:
display:relative;
margin-bottom: 75px;
color: ${props => props.theme.colors.contentForeground};
display:flex;

& svg {
border-right: 1px solid currentColor;
height: 100%;
padding: 6.125px;
min-width: 50px;
};

& p {
margin: 12.5px 25px;
font-weight: bolder;
text-transform: capitalize;
}

`;

const Header = styled.div`
  margin-top: 125px;
  margin-bottom: 12.5px;
  font-size: ${props => props.theme.text.sizes.title};
  color: ${props => props.theme.colors.textPrimary};
  font-weight: bolder;
  font-family: "brown-bold";
`;
export const blogPageQuery = graphql`
  query BlogQuery {
    allMarkdownRemark(sort: { order: DESC, fields: [frontmatter___date] }) {
      edges {
        node {
          id
          excerpt(pruneLength: 250)
          frontmatter {
            date(formatString: "MMMM DD, YYYY")
            path
            title
            thumbnail
            metaDescription
          }
        }
      }
    }
  }
`;

//       render={data => {
//         const catagoryMappings = {}; // holds all the catagories as per the PATH mappings in each blog post fetched

//         (() =>
//           data.allMarkdownRemark.edges.map(edge => {
//             const thisCatagory = edge.node.frontmatter.path.split("/")[2];
//             if (catagoryMappings[thisCatagory])
//               // push edge to array
//               catagoryMappings[thisCatagory].push(edge);
//             else catagoryMappings[thisCatagory] = []; // empty arrwy
//           }))();
//         console.log(catagoryMappings);
//         // get catagories from path of blog, use those catagoreis to correspond to a component to handle it, iterate on all the posts of that catagory passing it to that component
//         return Object.keys(catagoryMappings).map((catagory, i) => {
//           // get posts
//           const SectionComponent = sections[catagory]; // get tangible reference for react to dynamically generate a component from
//           return (
//             <section
//               id={catagory}
//               key={catagory + i}
//               style={sectionStyles[catagory]} // customize styling locally for each catagory oficially mapped out
//             >
//                 {catagory.toUpperCase()}
//               </div>
//               <div className="blog__wrapper" id="blog__wrapper">
//                 {/** You can filter your posts based on some criteria */}
//                 {catagoryMappings[catagory]
//                   .filter(edge => !!edge.node.frontmatter.date)
//                   .map(edge => (
//                     <CSSTransition
//                       in={inProp}
//                       timeout={1000}
//                       classNames="left-transition"
//                     >
//                       <SectionComponent key={edge.node.id} post={edge.node} />
//                     </CSSTransition>
//                   ))}
//               </div>
//             </section>
//           );
//         });
//       }}
//     />
//   );
// });

// {
//   "groupName": "languages",
//   "skills": [
//     [
//       {
//         "name": "languages",
//         "skillName": "",
//         "icon": "import link to require",
//         "description": ""
//       },
//       {
//         "name": "languages",
//         "skillName": "",
//         "icon": "import link to require",
//         "description": ""
//       },
//     ]
//   },
// ],
// "group": {
//   "groupName": "languages",
//   "skills": [
//     "group": {
//       "groupName": "languages",
//       "skills": [
//         {
//           "name": "languages",
//           "skillName": "",
//           "icon": "import link to require",
//           "description": "",
//         },
//         {
//           "name": "languages",
//           "skillName": "",
//           "icon": "import link to require",
//           "description": "",
//         ],
//       ]
//     },
//   },
// },
// export const experienceData = {
//   australianwarmemorial: {
//     description: `I create software applications for online businesses like you, so you can focus on getting your users needs fulfilled`,
//     location: "canberra",
//     employer: "Australian War Memorial",
//     imgSrc: "./assets/image-2.jpg",
//     date: "april 2020",
//     role: "developer"
//   },
//   yum: {
//     description: `I create software applications for online businesses like you, so you can focus on getting your users needs fulfilled`,
//     employer: "Australian War Memorial",
//     location: "canberra",
//     imgSrc: "./assets/image-3.jpg",
//     date: "december 2020",
//     role: "developer"
//   },
//   icn: {
//     description: ``,
//     employer: "Australian War Memorial",
//     location: "",
//     imgSrc: "./assets/image-2.jpg",
//     date: "",
//     role: ""
//   },
//   larchegenesaret: {
//     description: ``,
//     employer: "Australian War Memorial",
//     location: "",
//     imgSrc: "./assets/image-2.jpg",
//     date: "",
//     role: ""
//   }
// };
// use arrays, the logic handling this uses .map which wont work on objects
// module.exports = {
//   portfolio: [
//     {
//       model: false,
//       title: "VR Movement Recognition",
//       mediaUrl: "https://i.imgur.com/t55NQ7m.mp4",
//       catagory: "VR Application",
//       description:
//         "Scores users movement against pre-recorded movement. Providing an extensible solution for training, used here in the context of Tai Chi",
//       blog: {
//         about: "",
//         objectives: "",
//         results: ""
//       }
//     },
//     {
//       model: false,
//       title: "On Closer Inspection",
//       mediaUrl: "https://i.imgur.com/2acj61h.mp4",
//       catagory: "Fullstack Application",
//       description:
//         "A project I was involved in during my time at the Australian War Memorial, a configurable VR experience for virtual exhibits",
//       blog: {
//         about: "",
//         objectives: "",
//         results: ""
//       }
//     },
//     {
//       model: false,
//       title: "OpenGL Game engine",
//       mediaUrl: "https://i.imgur.com/RO4eieT.mp4",
//       catagory: "Graphics Programming",
//       description: "Minimal viable game engine coded in c++ on top of openGL",
//       blog: {
//         about: "",
//         objectives: "",
//         results: ""
//       }
//     },
//     {
//       model: false,
//       title: "Python apps",
//       mediaUrl: "https://i.imgur.com/jaP2kH5.mp4",
//       catagory: "Desktop Application",
//       description: "Simple console/GUI apps made in python",
//       blog: {
//         about: "",
//         objectives: "",
//         results: ""
//       }
//     }
//     //   {
//     //     "model": true,
//     //     "title": "3d character",
//     //     "mediaUrl": "https://sketchfab.com/models/64f06381ab2f47139c09875ec0c7b254/embed",
//     //     "catagory": "3d Model",
//     //     "description": "Rigged game charecter for an upcoming vfx show reel"
//     //   },
//     //   {
//     //     "model": true,
//     //     "title": "Mech Bust",
//     //     "mediaUrl": "https://sketchfab.com/models/ea71b4a0e59443529d5cfb082953059b/embed",
//     //     "catagory": "3d Model",
//     //     "description": "3d mech bust made in z-brush"
//     // }
//   ],
//   about: [
//     {
//       title: "BACKGROUND",
//       description: `Before graduating University I was contracted for the Australian War Memorial. I created 3D/VR experiences for the 1.14 million visitors to Nations Capital.
//     <pre></pre>
//     Currently I am the lead software developer/designer for Mentoras, where I am creating a marketplace for consultants and mentors
//     <pre></pre>
//     In my free time i’m a freelance designer and software developer. And a vfx artist currently assembling a show-reel`,
//       mediaUrl: ""
//     },
//     {
//       title: "photo of me",
//       description: "photo of me",
//       mediaUrl: "https://i.imgur.com/9oRAGBj.jpg"
//     }
//   ],
//   description: [
//     `
//     Let’s build and design the future.<br>
//     Any programming language.<br>
//     Any technology.<br>
//     Any design.
//     `
//     // "UX designer",
//     // "UI developer",
//     // "3D designer",
//     // "Software Developer"
//   ],
//   footer: [
//     {
//       title: "phone",
//       value: "+61 0475565709"
//     },
//     {
//       title: "email",
//       value: "aidenf09@yahoo.com"
//     }
//   ],
// };
