import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="bg-white">
      <div className="container mx-auto px-6 py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
          {/* Company info section*/}
          <div>
            <h3 className="text-xl font-bold text-pamoja-purple mb-6">
              Pamoja Health
            </h3>
            <p className="text-neutral-600 mb-6">
              Your safe space for sexual and reproductive health information and
              services.
            </p>
            <div className="flex space-x-4">
              {["facebook", "twitter", "instagram"].map((social) => (
                <a
                  key={social}
                  href={`#${social}`}
                  className="text-neutral-400 hover:text-pamoja-purple"
                >
                  <span className="sr-only">{social}</span>
                  {/*Social icons to go here soon */}
                </a>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-semibold mb-6">Quick Links</h4>
            <ul className="space-y-4">
              {[
                { name: "Find Services", path: "/services" },
                { name: "Ask Questions", path: "/chat" },
                { name: "Learn", path: "/learn" },
                { name: "About Us", path: "/about" },
              ].map((item) => (
                <li key={item.name}>
                  <Link
                    to={item.path}
                    className="text-neutral-600 hover:text-pamoja-purple"
                  >
                    {item.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h4 className="font-semibold mb-6">Resources</h4>
            <ul className="space-y-4">
              {[
                { name: "Privacy Policy", path: "/privacy-policy" },
                { name: "Terms of Use", path: "/terms" },
                { name: "Support", path: "/support" },
                { name: "Contact", path: "/contact" },
              ].map((item) => (
                <li key={item.name}>
                  <Link
                    to={item.path}
                    className="text-neutral-600 hover:text-pamoja-purple"
                  >
                    {item.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Emergency Contact */}
          <div>
            <h4 className="font-semibold mb-6">Emergency Help</h4>
            <p className="text-neutral-600 mb-2">24/7 Helpline</p>
            <p className="text-pamoja-purple text-xl font-bold mb-4">
              Call 112
            </p>
            <div className="bg-pamoja-purple/5 p-4 rounded-lg">
              <p className="text-sm text-neutral-600">
                If you're experiencing an emergency, please call your local
                emergency services immediately.
              </p>
            </div>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-neutral-100">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-neutral-600 text-sm">
              © {new Date().getFullYear()} Pamoja. All rights reserved.
              {/* Built by{" "}
              <a
                className="underline font-bold"
                href="https://keyypress.com"
                target="_blank"
              >
                {" "}
                Keyy<span className="font-bold text-orange-500">Press</span>
              </a> */}
            </p>
            <div className="flex space-x-6 mt-4 md:mt-0">
              <Link
                to="/privacy-policy"
                className="text-sm text-neutral-600 hover:text-pamoja-purple"
              >
                Privacy Policy
              </Link>
              <Link
                to="/terms"
                className="text-sm text-neutral-600 hover:text-pamoja-purple"
              >
                Terms of Service
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
