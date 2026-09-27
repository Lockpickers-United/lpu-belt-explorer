#!/usr/bin/perl
use strict;
use warnings FATAL => 'all';
#use warnings;

use local::lib;
use JSON;
use URI::Simple;

my $workPath = "/home/dh_m5s5pf/firebase";
#$workPath = "/Users/nealbayless/LOCAL/GitHubLocal/explore-lpubelts-com-node/src/projects/fetchWishlist";

my %orgs = ("81750a99" => "LPUlocks.com", "07034c0f" => "LocksportBazaar", "cdfac03d" => "LockHunter");

# https://explore.lpubelts.com/API/profile/?token=cdfac03d&id=GGplAdctTfVDLVvYsfIADJmfp8f2

my $args = $ENV{'QUERY_STRING'} ? "?$ENV{'QUERY_STRING'}" : "?token=cdfac03d&id=GGplAdctTfVDLVvYsfIADJmfp8f2";

###############################

print "Content-Type: application/json\n\n";

my $uri = URI::Simple->new($args);
my $token = %{$uri->query}{"token"};
my $id = %{$uri->query}{"id"};
my $org = $orgs{$token};

my @outputData;

unless ($org) {
    my @info = ("UNAUTHORIZED", "Token: $token", "Token Holder: NOT FOUND", "All requests are logged and monitored.");
    push(@outputData, \@info);
    my %status = ("status" => "401 Unauthorized");
    push(@outputData, \%status);
    jsonIt(\@outputData);
    exit;
}

my $backupFile = "$workPath/backup.json";

my $data;
if (open(my $json_stream, $backupFile)) {
    local $/ = undef;
    my $json = JSON->new;
    $data = $json->decode(<$json_stream>);
    close($json_stream);
}
else {
    print "ERROR opening $backupFile\n\n";
    exit;
}

my $profile = $data->{__collections__}->{lockcollections}->{$id};
unless ($profile) {
    my @info = ("NO SUCH USER", "Token: $token", "Token Holder: $org", "All requests are logged and monitored.");
    push(@outputData, \@info);
    my %status = ("status" => "418 No Such User");
    push(@outputData, \%status);
    jsonIt(\@outputData);
    exit;
}

my %collections = (
    "wishlist"     => $profile->{wishlist},
    "own"          => $profile->{own},
    "safelocksOwn" => $profile->{safelocksOwn},
);


# TODO: check if no items in wishlist

my %profileData = ("collections" => \%collections);
my @info = ("This is proprietary data and may not be used without express written permission.",
    "We require any entities using using this data in any way to honor the LPUbelts.com Privacy Policy, found at https://lpubelts.com/#/privacy",
    "Token: $token",
    "Token Holder: $org",
    "All requests are logged and monitored."
);
$profileData{"status"} = "200 OK";
$profileData{"userId"} = $id;
$profileData{"info"} = \@info;

jsonIt(\%profileData);

sub jsonIt {
    my $json = JSON->new;
    my $json_text = $json->pretty->encode($_[0]);
    print "$json_text\n\n";
}

