__author__ = 'nnaskov'

import os
import unittest
import app.models as models

from google.appengine.api import memcache
from google.appengine.ext import ndb
from google.appengine.ext import testbed


class BlankDatastoreTestCase(unittest.TestCase):
    """
    This class works with a blank database.
    """
    def setUp(self):
        # First, create an instance of the Testbed class.
        self.testbed = testbed.Testbed()
        # Then activate the testbed, which prepares the service stubs for use.
        self.testbed.activate()
        # Next, declare which service stubs you want to use.
        self.testbed.init_datastore_v3_stub()
        self.testbed.init_memcache_stub()
        # Clear ndb's in-context cache between tests.
        # This prevents data from leaking between tests.
        # Alternatively, you could disable caching by
        # using ndb.get_context().set_cache_policy(False)
        ndb.get_context().clear_cache()

class LocalDatastoreTesetCase(unittest.TestCase):
    """
    This class works with a the current local (on your machine) database.
    """
    def setUp(self):
        # First, create an instance of the Testbed class.
        self.testbed = testbed.Testbed()
        # Then activate the testbed, which prepares the service stubs for use.
        self.testbed.activate()
        self.testbed.setup_env()
        # Next, declare which service stubs you want to use.
        # Test on a new data
        # self.testbed.init_datastore_v3_stub()
        self.testbed.init_datastore_v3_stub()
        self.testbed.init_memcache_stub()
        # Clear ndb's in-context cache between tests.
        # This prevents data from leaking between tests.
        # Alternatively, you could disable caching by
        # using ndb.get_context().set_cache_policy(False)
        ndb.get_context().clear_cache()


if __name__ == '__main__':
    unittest.main()