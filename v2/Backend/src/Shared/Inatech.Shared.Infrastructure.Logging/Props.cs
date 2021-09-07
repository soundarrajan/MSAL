using System.Collections.Generic;
using System.Runtime.Serialization;

namespace Inatech.Shared.Infrastructure.Logging
{
    /// <summary>
    /// Used as a shorter name for <see cref="Dictionary{TKey,TValue}"/>
    /// </summary>
    public class Props : Dictionary<string, object>
    {
        public Props()
        {
        }

        public Props(IDictionary<string, object> dictionary) : base(dictionary)
        {
        }

        public Props(IDictionary<string, object> dictionary, IEqualityComparer<string> comparer) : base(dictionary, comparer)
        {
        }

        public Props(IEnumerable<KeyValuePair<string, object>> collection) : base(collection)
        {
        }

        public Props(IEnumerable<KeyValuePair<string, object>> collection, IEqualityComparer<string> comparer) : base(collection, comparer)
        {
        }

        public Props(IEqualityComparer<string> comparer) : base(comparer)
        {
        }

        protected Props(SerializationInfo info, StreamingContext context) : base(info, context)
        {
        }

        public Props(int capacity) : base(capacity)
        {
        }

        public Props(int capacity, IEqualityComparer<string> comparer) : base(capacity, comparer)
        {
        }
    }
}