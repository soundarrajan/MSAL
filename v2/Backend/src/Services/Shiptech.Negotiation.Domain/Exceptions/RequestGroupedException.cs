using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Shiptech.Negotiation.Domain.Exceptions
{
    public class RequestGroupedException : Exception
    {
        public RequestGroupedException() { }

        public RequestGroupedException(string message)
        : base(message) { }

        public RequestGroupedException(string message, Exception inner)
            : base(message, inner) { }
    }
}
