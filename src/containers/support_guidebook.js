import React, { PureComponent } from "react";
import { connect } from "react-redux";
import { getCurrentMember } from "../reducers/common_reducer";
import { Helmet } from "react-helmet";
import { Link } from "react-router-dom";
import logo_full from "../img/logos/logo_full.svg";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

class SupportGuide extends PureComponent {
  render() {
    return (
      <div className="static-page">
        <Helmet>
          <title>Using RelayPad</title>
        </Helmet>
        <nav className="navbar fixed-top navbar-light bg-light">
          <Link
            to={"/" + this.props.currentMember.team.slug + "/notes/"}
            id="notebookBtnLink"
            className="btn btn-outline-primary btn-sm"
          >
            <FontAwesomeIcon
              icon={["fal", "books"]}
              fixedWidth
              title="Toggle sidebar"
              data-tip="Toggle sidebar"
            />{" "}
            Your Notebook
          </Link>
          <Link to="/" id="relaypadLogo">
            <img src={logo_full} height="30" alt="RelayPad" />
          </Link>
        </nav>
        <div className="content with-navbar">
          <h1 id="postTitle">Using RelayPad</h1>
          <p>
            Thanks for checking out RelayPad, the best way for you to organize
            and share your team’s ideas. It’s a secure home to record your
            plans, research, learnings and updates.
          </p>
          <p>Here are a few tips to get you started.</p>
          <h2>Creating and Organizing Notes</h2>
          <p>
            The RelayPad editor makes it easy to capture your stream of
            conscious thoughts or lay out your grand vision. It offers just
            enough formatting options to present your work in a clear and
            readable layout.
          </p>
          <p>
            Tags let you organize your notes as loosely or as granularly as
            you’d like, and you can star notes to bookmark them for future
            reference.
          </p>
          <h2>Publishing Notes to Your Team</h2>
          <p>
            By default, notes you create on RelayPad are viewable only by
            yourself. You can share a note with your team, at which point anyone
            on your Slack team can read it. Your notes are never viewable by
            anyone outside of your Slack organization.
          </p>
          <p>
            To publish a note, click the “Share” button in the upper right
            section of your note. Notes that have been shared will have a team
            icon in the list view.
          </p>
          <p>
            Once your note is shared, you can paste the note’s URL in Slack,
            emails, or wherever you want to reference it. Team members can
            comment on your note but only you can edit the note content.
          </p>

          <h2>Get in Touch</h2>
          <p>
            We’d love to hear about your experience with RelayPad. Have
            questions, suggestions, or any other feedback?
          </p>
          <p>
            Email:{" "}
            <a href="mailto:feedback@relaypad.com">feedback@relaypad.com</a>
            <br />
            Twitter:{" "}
            <a
              href="https://twitter.com/relaypad"
              target="_blank"
              rel="noopener noreferrer"
            >
              @RelayPad
            </a>
            <br />
            Blog:{" "}
            <a
              href="https://medium.com/relaypad"
              target="_blank"
              rel="noopener noreferrer"
            >
              https://medium.com/relaypad
            </a>
          </p>
          <p>Thanks again for using RelayPad!</p>
        </div>
        <footer>
          <div className="footerLinks">
            <p>
              &copy; {new Date().getFullYear()} RelayPad{" "}
              <a href="https://relaypad.com/about">About Us</a>
              <a href="https://relaypad.com/terms">Terms</a>
              <a href="https://relaypad.com/privacy">Privacy</a>
              <a
                id="blogLink"
                href="https://medium.com/relaypad"
                target="_blank"
                rel="noopener noreferrer"
              >
                Blog
              </a>
              <a href="mailto:team@relaypad.com">Help</a>
            </p>
          </div>
        </footer>
      </div>
    );
  }
}

const mapStateToProps = state => ({
  currentMember: getCurrentMember(state)
});

export default connect(mapStateToProps)(SupportGuide);
